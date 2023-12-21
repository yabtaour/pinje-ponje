import {
  BadRequestException,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
  UseFilters,
  createParamDecorator,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import {
  ChatRole,
  ChatRoom,
  MemberState,
  MessageState,
  NotificationType,
  Prisma,
  RoomType,
} from '@prisma/client';
import { Transform, plainToClass } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import * as crypto from 'crypto';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendsActionsDto } from 'src/user/dto/FriendsActions-user.dto';
import { chatActionsDto } from './dto/actions-dto';
import { updateRoomDto } from './dto/update-room.dto';

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
  id?: number;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  state: MessageState;
}

@Injectable()
@UseFilters(new GlobalExceptionFilter())
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async updateConversationRead(user_id: number, payload: any, status: boolean) {
    const roomid = parseInt(String(payload.roomId));
    if (Number.isNaN(roomid))
      throw new HttpException('Invalid roomId.', HttpStatus.BAD_REQUEST);

    try {
      await this.prisma.roomMembership.update({
        where: {
          userId_roomId: {
            userId: user_id,
            roomId: roomid,
          },
        },
        data: {
          read: status,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Prisma: Bad request encountered.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateRoomData(
    user_id: number,
    roomid: number,
    payload: updateRoomDto,
  ) {
    let { name, password, roomType } = payload;
    if (
      (name !== undefined && name === null) ||
      (password !== undefined && password === null) ||
      (roomType !== undefined && roomType === null)
    )
      throw new HttpException(
        'Arguments cannot be null or undefined',
        HttpStatus.BAD_REQUEST,
      );

    if (roomType === RoomType.PROTECTED) {
      if (password === undefined) {
        throw new HttpException(
          'Password must be provided',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      password = null;
    }

    try {
      const existingRoom = await this.prisma.chatRoom.findUnique({
        where: {
          id: roomid,
        },
      });

      if (!existingRoom) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      const updatedRoom = await this.prisma.chatRoom.update({
        where: {
          id: roomid,
        },
        data: {
          name,
          password,
          roomType,
        },
      });
      return updatedRoom;
    } catch (e) {
      throw new HttpException(
        'Prisma: Bad request encountered.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addAdmin(userid: number, roomid: number, payload: FriendsActionsDto) {
    const peer_id = parseInt(String(payload.id));

    if (Number.isNaN(peer_id)) {
      throw new BadRequestException();
    }

    if (!(await this.isUserAdminInRoom(roomid, userid, peer_id))) {
      throw new HttpException(
        'Not Allowed to do this action',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.prisma.roomMembership.update({
        where: {
          userId_roomId: {
            userId: peer_id,
            roomId: roomid,
          },
        },
        data: {
          role: ChatRole.ADMIN,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Prisma: Bad request encountered.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeAdmin(
    userid: number,
    roomid: number,
    payload: FriendsActionsDto,
  ) {
    const peer_id = parseInt(String(payload.id));

    if (Number.isNaN(peer_id)) {
      throw new BadRequestException();
    }

    if (!(await this.isUserAdminInRoom(roomid, userid, peer_id))) {
      throw new HttpException(
        'Not Allowed to do this action',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      await this.prisma.roomMembership.update({
        where: {
          userId_roomId: {
            userId: peer_id,
            roomId: roomid,
          },
        },
        data: {
          role: ChatRole.MEMBER,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Prisma: Bad request encountered.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async inviteToPrivateRoom(
    userid: number,
    room_id: number,
    payload: FriendsActionsDto,
  ) {
    const peer_id = parseInt(String(payload.id));
    if (Number.isNaN(peer_id)) throw new BadRequestException();

    console.log(userid, room_id);
    const membershipInTheRoom = await this.prisma.roomMembership.findFirst({
      where: {
        userId: userid,
        roomId: room_id,
      },
    });

    if (membershipInTheRoom === null)
      throw new HttpException(
        'Membership records not found for the specified users in the room.',
        HttpStatus.BAD_REQUEST,
      );

    const patchedRoom = await this.prisma.roomMembership.create({
      data: {
        userId: peer_id,
        roomId: room_id,
        role: ChatRole.MEMBER,
        state: MemberState.ACTIVE,
      },
    });

    const roomMemberShip = await this.prisma.roomMembership.findUnique({
      where: {
        id: patchedRoom.id,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    this.notificationService.create({
      senderId: userid,
      receiverId: peer_id,
      type: NotificationType.GROUPE_CHAT_INVITE,
    });

    return roomMemberShip;
  }

  async createRoom(userid: number, payload: any) {
    const roomId = await this.generateUniqueRoomId();
    const role = payload.type !== 'DM' ? 'OWNER' : 'MEMBER';

    if (payload.type === 'DM' && payload.peer_id === undefined)
      throw new HttpException(`Peer id is required`, HttpStatus.BAD_REQUEST);

    if (payload.type === 'PROTECTED' && payload.password === undefined) {
      throw new HttpException(
        `Room password is required`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (payload.type !== 'PROTECTED') delete payload.password;

    if (Object.values(RoomType).includes(payload.type) === false)
      throw new HttpException('bad room type', HttpStatus.BAD_REQUEST);

    const room = await this.prisma.chatRoom.create({
      data: {
        name: payload.name || roomId,
        roomType: (payload.type as RoomType) || 'PUBLIC',
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

    delete room.password;
    return room;
  }

  async joinRoom(userid: number, payload: joinRoomDto, room_id: number) {
    try {
      const roomid = parseInt(String(room_id));
      if (Number.isNaN(roomid))
        throw new HttpException('roomid requied', HttpStatus.BAD_REQUEST);
      const room = await this.prisma.chatRoom.findUnique({
        where: {
          id: roomid,
        },
        select: {
          id: true,
          name: true,
          password: true,
          roomType: true,
        },
      });
      if (!room)
        throw new HttpException(`Room not found`, HttpStatus.NOT_FOUND);

      if (room.roomType === 'PROTECTED' && room.password !== payload.password)
        throw new HttpException(
          `valid password is required`,
          HttpStatus.FORBIDDEN,
        );

      if ((await this.isUserInRoom(roomid, userid)) === true)
        throw new HttpException(
          `You are already a member of this room`,
          HttpStatus.CONFLICT,
        );

      const patchedRoom = await this.prisma.chatRoom.update({
        where: {
          id: roomid,
        },
        data: {
          members: {
            create: [
              {
                user: { connect: { id: userid } },
                role: 'MEMBER' as ChatRole,
              },
            ],
          },
        },
        include: {
          messages: {
            select: {
              content: true,
              state: true,
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
              // userId: { not: userid },
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
      });
      delete patchedRoom.password;
      return patchedRoom;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientUnknownRequestError ||
        Prisma.PrismaClientKnownRequestError
      ) {
        throw e;
      } else throw e;
    }
  }

  async leave_room(userid: number, payload: joinRoomDto, roomId: number) {
    try {
      const roomMembership = await this.prisma.roomMembership.delete({
        where: {
          userId_roomId: {
            userId: userid,
            roomId: roomId,
          },
        },
      });

      if (roomMembership.role === ChatRole.OWNER) {
        const newOwner = await this.prisma.roomMembership.findFirst({
          where: {
            roomId: roomId,
            role: ChatRole.MEMBER,
          },
        });
        if (newOwner) {
          await this.prisma.roomMembership.update({
            where: {
              userId_roomId: {
                userId: newOwner.userId,
                roomId: roomId,
              },
            },
            data: {
              role: ChatRole.OWNER,
            },
          });
        }
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new HttpException(
          'Prisma: Bad request encountered.',
          HttpStatus.BAD_REQUEST,
        );
      } else throw e;
    }
  }

  // switch to unique name
  async getRoomByid(roomId: number): Promise<ChatRoom> {
    try {
      const room = await this.prisma.chatRoom.findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
          name: true,
          password: true,
          roomType: true,
          updatedAt: true,
          createdAt: true,
        },
      });

      if (!room) {
        throw new HttpException(`Room not found`, HttpStatus.NOT_FOUND);
      }

      if (['PRIVATE', 'DM'].includes(room.roomType)) {
        throw new HttpException(
          `Room with ID ${roomId} either doesn't exist or is not public`,
          HttpStatus.NOT_FOUND,
        );
      }

      return room;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new HttpException(
          'Prisma: Bad request encountered.',
          HttpStatus.BAD_REQUEST,
        );
      } else throw e;
    }
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
                state: true,
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
              include: {
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
              // where: {
              //   userId: { not: userId },
              //   state: {
              //     in: ['ACTIVE', 'MUTED'],
              //   },
              // },
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
          in: ['PROTECTED', 'PUBLIC'],
        },
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

  async getRoomUsers(
    user_id: number,
    room_id: number,
    params: PaginationLimitDto,
  ) {
    // Func Scope Start : getRoomUsers

    const roomId = await this.prisma.chatRoom.findUnique({
      where: {
        id: room_id,
      },
    });
    if (!roomId) {
      throw new WsException(`Room not found`);
    }

    if ((await this.isUserInRoom(roomId.id, user_id)) === false) {
      throw new WsException(`You are not a member of this room`);
    }

    const users = await this.prisma.roomMembership.findMany({
      where: {
        roomId: roomId.id,
      },
      select: {
        state: true,
        role: true,
        user: {
          select: {
            username: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
      skip: params.skip,
      take: params.take,
    });

    return users;
  }

  // idea : insetead of delete the user from the room we can just change the state to kicked
  async kickUserFromRoom(user_id: number, payload: chatActionsDto) {
    const roomid = parseInt(String(payload.id));
    const peer_id = parseInt(String(payload.userId));
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    if ((await this.isUserAdminInRoom(roomid, user_id, peer_id)) === false)
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);

    const user = await this.prisma.roomMembership.delete({
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid,
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    return user;
  }

  async MuteUserFromRoom(user_id: number, payload: chatActionsDto) {
    const roomid = parseInt(String(payload.id));
    const peer_id = parseInt(String(payload.userId));
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    if ((await this.isUserAdminInRoom(roomid, user_id, peer_id)) === false)
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);

    const muteDurationInMilliseconds = 60 * 1000; // 1 minute
    const unmuteTime = new Date(Date.now() + muteDurationInMilliseconds);

    const updatedMember = await this.prisma.roomMembership.update({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid,
        },
      },
      data: {
        state: 'MUTED',
        unmuteTime: unmuteTime,
      },
    });
    return updatedMember;
  }

  async unMuteUser(user_id: number, payload: chatActionsDto) {
    const roomid = parseInt(String(payload.id));
    const peer_id = parseInt(String(payload.userId));
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    if ((await this.isUserAdminInRoom(roomid, user_id, peer_id)) === false)
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);

    const updatedMember = await this.prisma.roomMembership.update({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid,
        },
      },
      data: {
        state: 'ACTIVE',
        unmuteTime: null,
      },
    });
    return updatedMember;
  }

  async BanUserFromRoom(
    user_id: number,
    @ChatActions() payload: chatActionsDto,
  ) {
    const roomid = parseInt(String(payload.id));
    const peer_id = parseInt(String(payload.userId));
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    if ((await this.isUserAdminInRoom(roomid, user_id, peer_id)) === false)
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);
    const updatedMember = await this.prisma.roomMembership.update({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid,
        },
      },
      data: {
        state: 'BANNED',
      },
    });
    return updatedMember;
  }

  async UnBanUserFromRoom(
    user_id: number,
    @ChatActions() payload: chatActionsDto,
  ) {
    const roomid = parseInt(String(payload.id));
    const peer_id = parseInt(String(payload.userId));
    if (Number.isNaN(roomid) || Number.isNaN(peer_id))
      throw new BadRequestException();

    if ((await this.isUserAdminInRoom(roomid, user_id, peer_id)) === false)
      throw new HttpException(`Not Allowed`, HttpStatus.FORBIDDEN);

    const updatedMember = await this.prisma.roomMembership.update({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      where: {
        userId_roomId: {
          userId: peer_id,
          roomId: roomid,
        },
      },
      data: {
        state: 'ACTIVE',
      },
    });
    return updatedMember;
  }

  async createMessage(user_id: number, room_id: number, payload: MessageDto) {
    console.log('here', user_id, room_id);
    if (
      Number.isNaN(user_id) ||
      Number.isNaN(room_id) ||
      payload.message == undefined ||
      payload.state == undefined
    )
      throw new BadRequestException();
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: room_id,
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
          },
        },
      },
    });

    if (!room || !room.members[0])
      throw new WsException(
        `You are not a member of this room or the room doesn't exist`,
      );
    if (
      room.members[0].state === 'MUTED' &&
      room.members[0].unmuteTime > new Date()
    )
      throw new WsException(`You are muted from this room`);
    else await this.updateUserState(user_id, 'ACTIVE');
    if (room.members[0].state === 'BANNED')
      throw new WsException(`You are banned from this room`);

    const message = await this.prisma.chatMessage.create({
      data: {
        content: payload.message,
        state: payload.state,
        room: {
          connect: {
            id: room.id,
          },
        },
        user: {
          connect: {
            id: user_id,
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
            profile: true,
          },
        },
      },
    });
    // update many so there memebership would be false
    await this.prisma.roomMembership.updateMany({
      where: {
        roomId: room.id,
      },
      data: {
        read: false,
      },
    });
    this.updateConversationRead(user_id, { roomId: room.id }, true);
    return message;
  }

  async getMessages(
    user_id: number,
    @Param('room_id', ParseIntPipe) room_id: number,
    params: PaginationLimitDto,
  ) {
    console.log(params);
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
            state: true,
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
        // ...params, // need to be fixed is it used by socket but rest its all good to do
      },
    });

    if (room.length === 0 || room[0].members.length === 0) {
      throw new WsException(
        `You are not a member of this room or the room doesn't exist`,
      );
    }

    return room;
  }

  // leave here and move it later to extr file
  async generateUniqueRoomId(length: number = 50) {
    const prefix = 'RASY';
    const chossenPrefix = prefix[Math.floor(Math.random() * prefix.length)];
    const randomBytes = crypto.randomBytes(length);
    const roomId =
      chossenPrefix +
      randomBytes
        .toString('hex')
        .toUpperCase()
        .substring(0, length / 10);
    return roomId;
  }

  async isUserInRoom(roomId: number, userId: number): Promise<boolean> {
    const roomMembership = await this.prisma.roomMembership.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
      },
      select: {
        state: true,
      },
    });

    if (roomMembership && roomMembership.state === 'BANNED')
      throw new WsException(`You are banned from this room`);
    if (roomMembership && roomMembership.state === 'MUTED')
      throw new WsException(`You are muted from this room`);

    return !!roomMembership;
  }

  async isUserAdminInRoom(
    roomId: number,
    userId: number,
    peer_id: number,
  ): Promise<boolean> {
    try {
      const userMembership = await this.prisma.roomMembership.findFirst({
        where: {
          userId: userId,
          roomId: roomId,
          role: {
            in: ['ADMIN', 'OWNER'],
          },
        },
      });
      const peerMembership = await this.prisma.roomMembership.findFirst({
        where: {
          userId: peer_id,
          roomId: roomId,
        },
      });

      if (!userMembership || !peerMembership) return false;
      if (
        userMembership &&
        peerMembership &&
        peerMembership.role == 'OWNER' &&
        userMembership.role == 'ADMIN'
      )
        return false;
      if (
        userMembership &&
        peerMembership &&
        peerMembership.role == 'ADMIN' &&
        userMembership.role == 'ADMIN'
      )
        return false;
      if (
        userMembership &&
        peerMembership &&
        peerMembership.role == 'MEMBER' &&
        userMembership.role == 'MEMBER'
      )
        return false;
      return true;
    } catch (e: any) {
      throw new HttpException(
        'Membership records not found for the specified users in the room.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUserState(
    userId: number,
    newState: 'ACTIVE' | 'MUTED',
  ): Promise<void> {
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
