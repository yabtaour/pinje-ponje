import { Injectable, Logger, Patch } from '@nestjs/common';
import { CreateChatDmRoomDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ChatRoom, RoomType, ChatRole, User, Profile, RoomMembership } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ro } from '@faker-js/faker';
import { RoomDto } from './dto/room-dto';
import { get } from 'http';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthWithWs } from './dto/user-ws-dto';

@Injectable()
export class ChatService {

  constructor(private readonly prisma: PrismaService) {}



  async createRoom(socket: any, payload: CreateChatDmRoomDto) {
    const roomId = await this.generateUniqueRoomId();
    const role = (payload.type !== 'DM') ? 'OWNER' : 'MEMBER';

    if (payload.type === 'PROTECTED' && payload.password === undefined) {
      throw new WsException(`Room password is required`);
    }

    const room = await this.prisma.chatRoom.create({
      data: {
        name: roomId,
        roomType: payload.type as RoomType,
        password: payload.password,
        members: {
          create: [{
            user : { connect : { id : +socket.id } },
            role: role as ChatRole,
          }]
        }
      }
    })
    room.password = undefined;
    return room;
  }

  async joinRoom(socket: any, payload: any){

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        name : payload.name,
      },
      select: {
        id: true,
        password: true,
        roomType: true,
      }
    });
    if (!room)
      throw new WsException(`Room with name ${payload.name} not found`);

    if (room.roomType === 'PROTECTED' && room.password !== payload.password)
      throw new WsException(`Wrong password`);

    if (await this.isUserInRoom(+room.id, +socket.id) === true)
      throw new WsException(`You are already a member of this room`);

    const patchedRoom = await this.prisma.chatRoom.update({
      where: {
        name : payload.name,
      },
      data: {
      members: {
        create: [{
            user : { connect : { id : +socket.id } },
            role: 'MEMBER' as ChatRole,
          }]
        }
      }
    })
    patchedRoom.password = undefined;
    return patchedRoom;
  }
  
  // async leaveRoom(socket: any, payload: RoomDto){
  //   const userID = 3;
  //   const room = await this.prisma.chatRoom.update({
  //     where: {
  //       name : payload.name,
  //     },
  //     data: {
  //       members: {
  //         delete: [{
  //           user : { connect : { id : userID } },
  //         }]
  //       }
  //     }
  //   })
  //   return room;
  // }
  // switch to unique name
  async getRoomByNames(roomName: string): Promise<ChatRoom> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        name: roomName,
      },
      select: {
        id: true,
        name: true,
        password: true,
        roomType: true,
        updatedAt: true,
        createdAt: true,
      }
    })

    if  (!room) {
      throw new WsException(`Room with name ${roomName} not found`);
    }

    if (room.roomType === 'PRIVATE' || room.roomType === 'DM')
      throw new WsException(`Room With name ${roomName} doesn't exist or Not Public`);
    

    return room;
    // hna khas ncheck protect to del and privet to check passorwd
  }

  async getRoomsByUserId(userId: number, params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatRoomWhereUniqueInput;
    where?: Prisma.ChatRoomWhereInput;
    orderBy?: Prisma.ChatRoomOrderByWithRelationInput;
  }) {

    const { cursor, orderBy, skip, take } = params;

    // Retrieve the room memberships for the user
    const roomMemberships = await this.prisma.roomMembership.findMany({
      where: {
        userId: userId,
      },
      select: {
        state: true,
        room: {
          select: {
            id: true,
            name: true,
            roomType: true,
            updatedAt: true,
            createdAt: true,
          }
        },
      },
      skip,
      take,
      cursor,
      orderBy,
    });

    // Filter out the banned rooms
    const rooms = roomMemberships
      .filter((membership) => membership.state !== 'BANNED')
      .map((membership) => membership.room);

    return rooms;
  }

  
  async getRoomUsers(client : AuthWithWs, roonName: string, params: { // params : { skip?: number; take?: number; cursor?: Prisma.ChatRoomWhereUniqueInput; where?: Prisma.ChatRoomWhereInput; orderBy?: Prisma.ChatRoomOrderByWithRelationInput; }
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatRoomWhereUniqueInput;
    where?: Prisma.ChatRoomWhereInput;
    orderBy?: Prisma.ChatRoomOrderByWithRelationInput;
  }) { // Func Scope Start : getRoomUsers

    const roomId = await this.prisma.chatRoom.findUnique({
      where: {
        name: roonName,
      },
    });
    if (!roomId) {
      throw new WsException(`Room with name ${roonName} not found`);
    }

    if (await this.isUserInRoom(+roomId.id, +client.id) === false) {
      throw new WsException(`You are not a member of this room`);
    }


    const { cursor, orderBy, skip, take} = params;
    const users =  this.prisma.roomMembership.findMany({
      where: {
        roomId: roomId.id,
      },
      select: {
        state: true,
        role: true,
        user: {
          select: {
            profile : {
              select: {
                username: true,
                avatar: true,
              }
            }
          }
        },
      },
      skip,
      take,
      cursor,
      orderBy,
    });

    return users;
  }



  // idea : insetead of delete the user from the room we can just change the state to kicked  
  async kickUserFromRoom(client: any, payload: any) {

      const room = await this.prisma.chatRoom.findUnique({
        where: {
          name : payload.name,
        },
        select: {
          members: {
            where: {
              userId: payload.userId,
            }
          }
        }
      });

      if (await this.isUserAdminInRoom(room.members[0].roomId, +client.id) === false) {
        throw new WsException(`Not Allowed`);
      }

      const user = await this.prisma.roomMembership.delete({
        where: {
          id : room.members[0].id,
        },
        include: {
          user: {
            select: {
              profile: {
                select: {
                  username: true,
                }
              }
            }
          }
        }
      })

      console.log('user name', user.user.profile.username);

      const kickeduser = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
        select: {
          profile: {
            select: {
              username: true,
            }
          }
        }
      })
      return kickeduser;
  }
  

  async MuteUserFromRoom(client: any, payload: any): Promise<void> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        name : payload.name,
      },
      select: {
        members: {
          where: {
            userId: payload.userId,
          }
        }
      }
    });

    const muteDurationInMilliseconds = 300 * 1000; // Drt 5 minutes
    const unmuteTime = new Date(Date.now() + muteDurationInMilliseconds);
  
    await this.prisma.roomMembership.update({
      where: {
        id : room.members[0].id,
      },
      data: {
        state: 'MUTED',
        unmuteTime: unmuteTime,
      }
    })

    // i need a middleware to check if the user is muted or not to update the state
  }
  
  async BanUserFromRoom(client: any, payload: any): Promise<void> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        name : payload.name,
      },
      select: {
        members: {
          where: {
            userId: payload.userId,
          }
        }
      }
    });

    if (await this.isUserAdminInRoom(room.members[0].roomId, +client.id) === false) {
      throw new WsException(`Not Allowed`);
    }

    await this.prisma.roomMembership.update({
      where: {
        id : room.members[0].id,
      },
      data: {
        state: 'BANNED',
      }
    })
  }

  async UnBanUserFromRoom(client: any, payload: any): Promise<void> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        name : payload.name,
      },
      select: {
        members: {
          where: {
            userId: payload.userId,
          }
        }
      }
    });

    if (await this.isUserAdminInRoom(room.members[0].roomId, +client.id) === false) {
      throw new WsException(`Not Allowed`);
    }

    await this.prisma.roomMembership.update({
      where: {
        id : room.members[0].id,
      },
      data: {
        state: 'ACTIVE',
      }
    })
  }

  async createMessage(client: any, payload: any) {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        name : payload.name,
      },
      select: {
        id: true,
        members: {
          where: {
            userId: +client.id,
          }
        }
      }
    });
    if (!room || !room.members[0]) {
      // change the event name to ErrorEvent
      client.emit('ErrorEvent', "You are not a member of this room or the room doesn't exist");
      return;
    }
    if (room.members[0].state === 'MUTED') {
      client.emit('roomBroadcast', "You are muted");
      return;
    }

    if (room.members[0].state === 'BANNED') {
      client.emit('roomBroadcast', "You are banned");
      return;
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        content: payload.message,
        room: {
          connect: {
            id: room.id,
          }
        },
        user: {
          connect: {
            id: +client.id,
          },
        }
      }
    })
    const messageWithUser = {
      ...message,
      user: {
        id: +client.id,
        username: client.username,
        avatar: client.avatar,
      }
    }
    return messageWithUser;
  }

  async getMessages(client: any, payload: any) {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        name : payload.name,
      },
      select: {
        id: true,
        members: {
          where: {
            userId: +client.id,
          }
        }
      }
    });
    if (!room || !room.members[0]) {
      // change the event name to ErrorEvent
      client.emit('ErrorEvent', "You are not a member of this room or the room doesn't exist");
      return;
    }
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        roomId: room.id,
      },
      select: {
        content: true,
        createdAt: true,
        user: {
          select: {
            profile: {
              select: {
                username: true,
                avatar: true,
              }
            }
          }
        }
      }
    })
    return messages;
  }

  /**
  // Small function to help in other functions
  **/


  // leave here and move it later to extr file
  async generateUniqueRoomId(length: number = 50){
      const prefix = 'RASY';
      const chossenPrefix = prefix[Math.floor(Math.random() * prefix.length)];
      const randomBytes = crypto.randomBytes(length);
      const roomId = chossenPrefix + randomBytes.toString('hex').toUpperCase().substring(0, length / 10);
      return roomId;
  };
  
  async isUserInRoom(roomId: number, userId: number): Promise<boolean> {
    const roomMembership = await this.prisma.roomMembership.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
      }
    });
    console.log('roomMembership : ', !!roomMembership);
    return !!roomMembership;
  }

  async isUserAdminInRoom(roomId: number, userId: number): Promise<boolean> {
    const roomMembership = await this.prisma.roomMembership.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
        role: 'OWNER' || 'ADMIN',
      }
    });
    return !!roomMembership;
  }
  // Class END.
  }



  // room :  {
  //   id: 5,
  //   name: '89CF2',
  //   password: '123',
  //   roomType: 'DM',
  //   updatedAt: 2023-09-28T06:49:18.547Z,
  //   createdAt: 2023-09-28T06:49:18.547Z,
  //   members: [
  //     { id: 7, role: 'MEMBER', state: 'ACTIVE', userId: 1, roomId: 5 },
  //     { id: 8, role: 'MEMBER', state: 'ACTIVE', userId: 3, roomId: 5 }
  //   ]
  // }