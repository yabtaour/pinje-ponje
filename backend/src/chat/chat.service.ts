import { BadRequestException, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, Param, ParseIntPipe, Patch, Query, createParamDecorator } from '@nestjs/common';
import { CreateChatDmRoomDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ChatRoom, RoomType, ChatRole, User, Profile, RoomMembership } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { de, ro } from '@faker-js/faker';
import { RoomDto } from './dto/room-dto';
import { get } from 'http';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthWithWs } from './dto/user-ws-dto';
import { skip } from 'node:test';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';
import { chatActionsDto } from './dto/actions-dto';
import { error } from 'console';


export const ChatActions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): chatActionsDto => {
    const webSocketServer = ctx.switchToWs();
    
    if (!webSocketServer) {
      throw new WsException('Invalid WebSocket context');
    }
    const dataFromContext = webSocketServer.getData();
    
    if (!dataFromContext) {
      throw new WsException('No data found in WebSocket context');
    }
    return plainToClass(chatActionsDto, dataFromContext);
  },
);



export class PaginationLimitDto {

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  skip?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  take?: number;
}

export class joinRoomDto {

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  roomId?: number;

  @IsOptional()
  password?: string;
}


export class MessageDto {

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  roomId?: number;

  @IsNotEmpty()
  message: string;
}

@Injectable()
export class ChatService {

  constructor(private readonly prisma: PrismaService) {}



  async createRoom(userid: number, payload: CreateChatDmRoomDto) {
    const roomId = await this.generateUniqueRoomId();
    const role = (payload.type !== 'DM') ? 'OWNER' : 'MEMBER';

    if (payload.type === 'DM' && payload.peer_id === undefined)
      throw new WsException(`Peer id is required`);

    if (payload.type === 'PROTECTED' && payload.password === undefined) {
      throw new WsException(`Room password is required`);
    }

    const room = await this.prisma.chatRoom.create({
      data: {
        name: roomId,
        roomType: payload.type as RoomType,
        password: payload.password,
        members: {
          create: [
            {
              user: { connect: { id: userid } },
              role: role as ChatRole,
            },
          ],
        },
      },
    });

    if (payload.type == 'DM' && payload.peer_id !== undefined)
      await this.joinRoom(payload.peer_id, { }, room.id);

    delete room.password;
    return room;
  }

  async joinRoom(userid: number, payload: joinRoomDto, room_id: number) {

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id : room_id,
      },
      select: {
        id: true,
        name: true,
        password: true,
        roomType: true,
      }
    });
    if (!room)
      throw new WsException(`Room not found`);

    if (room.roomType === 'PROTECTED' && room.password !== payload.password)
      throw new WsException(`Wrong password`);

    if (await this.isUserInRoom(room_id, userid) === true)
      throw new WsException(`You are already a member of this room`);


    const patchedRoom = await this.prisma.chatRoom.update({
      where: {
        id : room_id,
      },
      data: {
      members: {
        create: [{
            user : { connect : { id : userid } },
            role: 'MEMBER' as ChatRole,
          }]
        }
      }
    })
    delete patchedRoom.password;
    return patchedRoom;
  }

  async leave_room(userid: number, payload: joinRoomDto, room_id: number) {
    const room = this.prisma.roomMembership.deleteMany({
      where: {
        AND: {
          userId : userid,
          roomId : room_id
        }
      }
    })
  }

  // switch to unique name
  async getRoomByNames(room_id: number): Promise<ChatRoom> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: room_id,
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
      throw new WsException(`Room with name ${room_id} not found`);
    }

    if (room.roomType === 'PRIVATE' || room.roomType === 'DM')
      throw new WsException(`Room With name ${room_id} doesn't exist or Not Public`);
    

    return room;
    // hna khas ncheck protect to del and privet to check passorwd
  }

  async getRoomsByUserId(userId: number, params: PaginationLimitDto) {
 
    const { skip: number, take } = params;
  
    // Retrieve the room memberships for the user
    const roomMemberships = await this.prisma.roomMembership.findMany({
      where: {
        userId: userId,
        state: {
          in: ['ACTIVE', 'MUTED'],
        },
      },
      include: {
        room: {
          include: {
            messages: {
              select: {
                content: true,
                createdAt: true,
                
                user: {
                  select: {
                    id: true,
                    username: true,
                    profile: {
                      select: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
            members: {
              where: {
                userId: { not: userId },
                state: {
                  in: ['ACTIVE', 'MUTED'],
                },
              },
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    status: true,
                    profile: {
                      select: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      skip: params.skip,
      take: params.take,
    });
    // Filter out the banned rooms
    // const rooms = roomMemberships
    //   .filter((membership) => membership.state !== 'BANNED')
    //   .map((membership) => membership.room);

    return roomMemberships;
  }

  async getRoomUsers(user_id : number, room_id: number, params: PaginationLimitDto) { // Func Scope Start : getRoomUsers

    const roomId = await this.prisma.chatRoom.findUnique({
      where: {
        id: room_id,
      },
    });
    if (!roomId) {
      throw new WsException(`Room not found`);
    }

    if (await this.isUserInRoom(roomId.id, user_id) === false) {
      throw new WsException(`You are not a member of this room`);
    }

    const users =  this.prisma.roomMembership.findMany({
      where: {
        roomId: roomId.id,
      },
      select: {
        state: true,
        role: true,
        user: {
          select: {
            username: true,
            profile : {
              select: {
                avatar: true,
              }
            }
          }
        },
      },
      skip : params.skip,
      take : params.take,
    });

    return users;
  }



  // idea : insetead of delete the user from the room we can just change the state to kicked  
  async kickUserFromRoom(user_id : number, payload: chatActionsDto){

    const roomid = parseInt(String(payload.id))
    const peer_id= parseInt(String(payload.userId)) 
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

      const room = await this.prisma.chatRoom.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          members: {
            where: {
              userId: peer_id,
              state: {
                in : ['ACTIVE', 'MUTED']
              }
            },
            select: {
              id: true,
              role: true
            }
          }
        }
      });

      if (
        !room ||
        room.members.length == 0 ||
        await this.isUserAdminInRoom(roomid, user_id, room.members[0].role) === false
      ){
        throw new WsException(`Not Allowed`);
      }

      const user = await this.prisma.roomMembership.delete({
        where: {
          id : room.members[0].id,
        },
        include: {
          user: {
            select: {
              username: true,
            }
          }
        }
      })

      const kickeduser = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
        select: {
          username: true,
        }
      })
      return kickeduser;
  }
  

  async MuteUserFromRoom(user_id : number, payload: chatActionsDto){

    const roomid = parseInt(String(payload.id))
    const peer_id= parseInt(String(payload.userId)) 
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomid
      },
      select: {
        members: {
          where: {
            userId: peer_id,
            state: {
              in : ['ACTIVE', 'MUTED']
            }
          },
          select: {
            id: true,
            role: true
          }
        }
      }
    });

    if (
      !room ||
      room.members.length == 0 ||
      await this.isUserAdminInRoom(roomid, user_id, room.members[0].role) === false
    ){
      throw new WsException(`Not Allowed`);
    }

    const muteDurationInMilliseconds = 60 * 1000; // 1 minute
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
  }

  async unMuteUser(user_id: number, payload: chatActionsDto) {

    const roomid = parseInt(String(payload.id))
    const peer_id= parseInt(String(payload.userId)) 
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomid,
      },
      select: {
        members: {
          where: {
            userId: peer_id,
            state: {
              in : ['ACTIVE', 'MUTED']
            }
          },
          select: {
            id: true,
            role: true
          }
        }
      },
    });
  
    if (
      !room ||
      room.members.length == 0 ||
      await this.isUserAdminInRoom(roomid, user_id, room.members[0].role) === false
    ){
      throw new WsException(`Not Allowed`);
    }
  
    const member = room.members[0];
  
    await this.prisma.roomMembership.update({
      where: {
        id: member.id,
      },
      data: {
        state: 'ACTIVE',
        unmuteTime: null,
      },
    });
  }
  
  
  
  async BanUserFromRoom(user_id : number, @ChatActions() payload: chatActionsDto) {

    const roomid = parseInt(String(payload.id))
    const peer_id= parseInt(String(payload.userId)) 
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: roomid
      },
      select: {
        id: true,
        members: {
          where: {
            userId: peer_id,
            state: {
              in : ['ACTIVE', 'MUTED']
            }
          },
          select: {
            id: true,
            role: true
          }
        }
      }
    });

    if (
      !room ||
      room.members.length == 0 ||
      await this.isUserAdminInRoom(roomid, user_id, room.members[0].role) === false
    ){
      throw new WsException(`Not Allowed`);
    }
    await this.prisma.roomMembership.update({
      where: {
        id : room.members[0].id
      },
      data: {
        state: 'BANNED',
      }
    })
  }

  async UnBanUserFromRoom(user_id : number, @ChatActions() payload: chatActionsDto){
    const roomid = String(payload.id)
    const peer_id= String(payload.userId) 
    if (Number.isNaN(+roomid) || Number.isNaN(+peer_id))
      throw new BadRequestException();

    const room = await this.prisma.chatRoom.findFirst({
      where: {
        id: parseInt(String(roomid))
      },
      select: {
        id: true,
        members: {
          where: {
            userId: parseInt(peer_id),
            state: {
              in : ['ACTIVE', 'MUTED']
            }
          },
          select: {
            id: true,
            role: true
          }
        }
      }
    });

    if (
      !room ||
      room.members.length == 0 ||
      await this.isUserAdminInRoom(parseInt(roomid), user_id, room.members[0].role) === false
    ){
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

  async createMessage(user_id : number, room_id: number, payload: MessageDto) {
    
    if (Number.isNaN(user_id) || Number.isNaN(room_id) || payload.message == undefined)
      throw new BadRequestException()
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id : room_id,
      },
      select: {
        id: true,
        members: {
          where: {
            userId: user_id,
          },
          select: {
            unmuteTime: true,
            state: true,
            user : {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    avatar: true,
                  }
                }
              }
            }
        }
      }
    }
  });

    if (!room || !room.members[0])
      throw new WsException(`You are not a member of this room or the room doesn't exist`);
    if (room.members[0].state === 'MUTED'  && room.members[0].unmuteTime > new Date())
      throw new WsException(`You are muted from this room`);
    else
      await this.updateUserState(user_id, 'ACTIVE');
    if (room.members[0].state === 'BANNED')
      throw new WsException(`You are banned from this room`);

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
            id: user_id,
          },
        }
      }
    })
    const messageWithUser = {
      ...message,
      user: {
        id: user_id,
        username: room.members[0].user.username,
        avatar: room.members[0].user.profile.avatar,
      }
    }
    return messageWithUser;
  }

  async getMessages(user_id : number, @Param('room_id', ParseIntPipe) room_id: number, params: PaginationLimitDto) {

    if (Number.isNaN(user_id) || Number.isNaN(room_id))
      throw new BadRequestException();
    const room = await this.prisma.chatRoom.findMany({
      where: {
        id: room_id,
        members: {
          some: {
            userId: user_id,
          },
        },
      },
      select: {
        id: true,
        members: {
          where: {
            userId: user_id,
          },
        },
        messages: {
          select: {
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        ...params
      },
    });
    
    if (room.length === 0 || room[0].members.length === 0) {
      throw new WsException(`You are not a member of this room or the room doesn't exist`);
    }
    
    return room;
  }    


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
      },
      select: {
        state: true,
      }
    });

    if (roomMembership && roomMembership.state === 'BANNED')
      throw new WsException(`You are banned from this room`);
    if (roomMembership && roomMembership.state === 'MUTED')
      throw new WsException(`You are muted from this room`);

    return !!roomMembership;
  }

  async isUserAdminInRoom(roomId: number, userId: number, peer_role: string): Promise<boolean> {
    const roomMembership = await this.prisma.roomMembership.findFirst({
      where: {
        userId: parseInt(String(userId)),
        roomId: parseInt(String(roomId)),
        role: 'OWNER' || 'ADMIN',
      }
    });
    if (roomMembership && peer_role == 'OWNER' && roomMembership.role == 'ADMIN')
      return false
    if (roomMembership && peer_role == 'ADMIN' && roomMembership.role == 'ADMIN')
      return false
    return !!roomMembership;
  }

  async updateUserState(userId: number, newState: 'ACTIVE' | 'MUTED'): Promise<void> {
    await this.prisma.roomMembership.updateMany({
      where: {
        userId: userId,
        state: 'MUTED',
        unmuteTime: {
          lte: new Date(), // Check for users whose unmuteTime has passed
        },
      },
      data: {
        state: newState,
        unmuteTime: null,
      },
    });
  }
  // Class END.
  }
