import { BadRequestException, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, Param, ParseIntPipe, Patch, Query, createParamDecorator } from '@nestjs/common';
import { CreateChatDmRoomDto } from './dto/create-chat.dto';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoom, RoomType, ChatRole, NotificationType, MemberState } from '@prisma/client';
import { WsException } from '@nestjs/websockets';
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';
import { chatActionsDto } from './dto/actions-dto';
import { updateRoomDto } from './dto/update-room.dto';
import { FriendsActionsDto } from 'src/user/dto/FriendsActions-user.dto';
import { NotificationService } from 'src/notification/notification.service';


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

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}


  async updateConversationRead(user_id: number, payload: any, status: boolean){
    const roomid = parseInt(String(payload.roomId))
    if (Number.isNaN(roomid))
      throw new BadRequestException();

      await this.prisma.roomMembership.update({
        where: {
          userId_roomId: {
            userId: user_id,
            roomId: roomid
          }
        },
        data: {
          read: status
        }
      });
  }

  async updateRoomData(user_id: number, roomid: number, payload: updateRoomDto){

    if (payload.roomType == RoomType.PROTECTED && payload.password == undefined)
      throw new HttpException("password must be provided", HttpStatus.BAD_REQUEST)

    const {name, password, roomType} = payload
    if ((name !== undefined && name === null) || (password !== undefined && password === null) || (roomType !== undefined && roomType === null))
      throw new HttpException("Arguments cannot be null or undefined", HttpStatus.BAD_REQUEST);
      

    console.log(payload.name, payload.roomType);
    const existingRoom = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomid,
      },
    });
    if (existingRoom) {
      const updatedRoom = await this.prisma.chatRoom.update({
        where: {
          id: roomid,
        },
        data: {
          name: name,
          password: password,
          roomType: roomType
        },
      });
      return updatedRoom;
    } else
      throw new HttpException("room not found", HttpStatus.NOT_FOUND);
  }

  async addAdmin(userid: number, roomid: number, payload: FriendsActionsDto){
    const peer_id = parseInt(String(payload.id))
    if (Number.isNaN(peer_id))
      throw new BadRequestException();

    if ( await this.isUserAdminInRoom(roomid, userid, peer_id) === false)
      throw new WsException(`Not Allowed`);

    const user = await this.prisma.roomMembership.update({
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid
        }
      },
      data: {
        role: ChatRole.ADMIN
      }
    })
    return 
  }

  async inviteToPrivateRoom(userid: number, room_id: number, payload: FriendsActionsDto){

    const peer_id = parseInt(String(payload.id))
    if (Number.isNaN(peer_id))
      throw new BadRequestException();

    console.log(userid, room_id);
    const membershipInTheRoom= await this.prisma.roomMembership.findFirst({
      where: {
        userId: userid,
        roomId: room_id
      }
    })

    if (membershipInTheRoom === null) throw new HttpException("You are not a memeber of this room", HttpStatus.BAD_REQUEST);
  
    const patchedRoom = await this.prisma.roomMembership.create({
      data: {
        userId: peer_id,
        roomId: room_id,
        role: ChatRole.MEMBER,
        state: MemberState.ACTIVE,
      },
    });

    this.notificationService.create({
      senderId: userid,
      receiverId: peer_id,
      type: NotificationType.GROUPE_CHAT_INVITE
    })

    return patchedRoom
  }

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
      throw new HttpException(`Room not found`, HttpStatus.NOT_FOUND);

    if (room.roomType === 'PROTECTED' && room.password !== payload.password)
      throw new HttpException(`Wrong password`, HttpStatus.FORBIDDEN);

    if (await this.isUserInRoom(room_id, userid) === true)
      throw new HttpException(`You are already a member of this room`, HttpStatus.CONFLICT);


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
    const room = await this.prisma.roomMembership.deleteMany({
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
      throw new HttpException(`Room With name ${room_id} doesn't exist or Not Public`, HttpStatus.NOT_FOUND);
    

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
    return roomMemberships;
  }


  async getUnjoinedRooms(userId: number, params: PaginationLimitDto) {
    const { skip, take } = params;
  
    // Retrieve rooms that the user has not joined
    const unjoinedRooms = await this.prisma.chatRoom.findMany({
      where: {
        members: {
          none: {
            userId: userId,
          },
        },
        roomType: {
          in : ['PROTECTED', 'PUBLIC']
        }
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        roomType: true,
      },
      skip: skip,
      take: take,
    });
  

    return unjoinedRooms;
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

    const users =  await this.prisma.roomMembership.findMany({
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

    if ( await this.isUserAdminInRoom(roomid, user_id, peer_id) === false )
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);

      const user = await this.prisma.roomMembership.delete({
        where: {
          userId_roomId: {
            userId: peer_id,
            roomId: roomid
          }
        },
        include: {
          user: {
            select: {
              username: true,
            }
          }
        }
      })
      return user;
  }
  

  async MuteUserFromRoom(user_id : number, payload: chatActionsDto){

    const roomid = parseInt(String(payload.id))
    const peer_id= parseInt(String(payload.userId)) 
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    if ( await this.isUserAdminInRoom(roomid, user_id, peer_id) === false )
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);

    const muteDurationInMilliseconds = 60 * 1000; // 1 minute
    const unmuteTime = new Date(Date.now() + muteDurationInMilliseconds);
  
    await this.prisma.roomMembership.update({
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid
        }
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

    if ( await this.isUserAdminInRoom(roomid, user_id, peer_id) === false )
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);
  
    await this.prisma.roomMembership.update({
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid
        }
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

    if ( await this.isUserAdminInRoom(roomid, user_id, peer_id) === false )
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);
    await this.prisma.roomMembership.update({
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid
        }
      },
      data: {
        state: 'BANNED',
      }
    })
  }

  async UnBanUserFromRoom(user_id : number, @ChatActions() payload: chatActionsDto){
    const roomid = parseInt(String(payload.id))
    const peer_id= parseInt(String(payload.userId)) 
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    if ( await this.isUserAdminInRoom(roomid, user_id, peer_id) === false )
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);

    await this.prisma.roomMembership.update({
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid
        }
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
      },
      include: {
        user: {
          select: {
            username: true,
            profile: true
          }
        }
      }
    })
    // update many so there memebership would be false
    await this.prisma.roomMembership.updateMany({
      where: {
        roomId: room.id
      },
      data: {
        read: false
      }
    })
    this.updateConversationRead(user_id, {roomId: room.id}, true)
    return message;
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

  async isUserAdminInRoom(roomId: number, userId: number, peer_id: number): Promise<boolean> {
    const userMembership = await this.prisma.roomMembership.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
        role: 'OWNER' || 'ADMIN',
      }
    });

    const peerMembership = await this.prisma.roomMembership.findFirst({
      where: {
        userId: peer_id,
        roomId: roomId,
      }
    });
    if (!userMembership || !peerMembership)
      return false
    if (userMembership && peerMembership && peerMembership.role == 'OWNER' && userMembership.role == 'ADMIN')
      return false
    if (userMembership && peerMembership && peerMembership.role == 'ADMIN' && userMembership.role == 'ADMIN')
      return false
    if (userMembership && peerMembership && peerMembership.role == 'MEMBER' && userMembership.role == 'MEMBER')
      return false
    return true;
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
