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

@Injectable()
export class ChatService {

  constructor(private readonly prisma: PrismaService) {}

  async createDmRoom(socket: any, payload: CreateChatDmRoomDto) {
    const roomId = await this.generateUniqueRoomId();
    const role = (payload.role !== 'MEMBER') ? 'OWNER' : 'MEMBER';

    if (payload.roomType === 'PROTECTED' && payload.password === undefined) {
      throw new Error(`Password is required for protected room`);
    }
    
    // here the token should be the user id after the verification
    console.log("socket id", socket.id);
    const userID = +socket.id;
    console.log("roomType : ", payload.roomType);
    const room = await this.prisma.chatRoom.create({
      data: {
        name: roomId,
        roomType: payload.roomType as RoomType,
        password: payload.password,
        members: {
          create: [{
            user : { connect : { id : userID } },
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
        password: true,
        roomType: true,
      }
    });
    if (!room) {
      Logger.error(`Room with name ${payload.name} not found`);
      throw new Error(`Room with name ${payload.name} not found`);
    }
    console.log("room : ", room);
    if (room.roomType === 'PROTECTED' && room.password !== payload.password) {
      Logger.error(`Password is incorrect`);
      throw new Error(`Password is incorrect`);
    }

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
  async getRoomByNames(roomName: string, roomType: RoomType): Promise<ChatRoom> {
    return this.prisma.chatRoom.findUnique({
      where: {
        name: roomName,
      }
    })
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

  
  async getRoomUsers(roonName: string, params: { // params : { skip?: number; take?: number; cursor?: Prisma.ChatRoomWhereUniqueInput; where?: Prisma.ChatRoomWhereInput; orderBy?: Prisma.ChatRoomOrderByWithRelationInput; }
    skip?: number;
    take?: number;
    cursor?: Prisma.ChatRoomWhereUniqueInput;
    where?: Prisma.ChatRoomWhereInput;
    orderBy?: Prisma.ChatRoomOrderByWithRelationInput;
  }) { // Func Scope Start : getRoomUsers

    const roomId = await this.prisma.chatRoom.findUnique({
      where: {
        name: roonName,
      }
    });
    if (!roomId) {
      throw new Error(`Room with name ${roonName} not found`);
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
  async kickUserFromRoom(client: string, payload: any): Promise<void> {

      console.log("name : ", payload.name);
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

      await this.prisma.roomMembership.delete({
        where: {
          id : room.members[0].id,
        }
      })
  }
  

  async MuteUserFromRoom(client: string, payload: any): Promise<void> {
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
  
  async BanUserFromRoom(client: string, payload: any): Promise<void> {
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

    await this.prisma.roomMembership.update({
      where: {
        id : room.members[0].id,
      },
      data: {
        state: 'BANNED',
      }
    })
  }

  // leave here and move it later to extr file
  async generateUniqueRoomId(length: number = 50){
      const prefix = 'RASY';
      const chossenPrefix = prefix[Math.floor(Math.random() * prefix.length)];
      const randomBytes = crypto.randomBytes(length);
      const roomId = chossenPrefix + randomBytes.toString('hex').toUpperCase().substring(0, length / 10);
      return roomId;
  };
  
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