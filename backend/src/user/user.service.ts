import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Param,
  ParseIntPipe,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { SignUpDto } from 'src/auth/dto/signUp.dto';
import { ChatService, PaginationLimitDto } from 'src/chat/chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { FriendsActionsDto } from './dto/FriendsActions-user.dto';
import { blockAndUnblockUserDto } from './dto/blockAndUnblock-user.dto';
import { CreateUserDtoIntra } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { ChatRole, NotificationType, RoomType } from '@prisma/client';
import { RoomDto } from 'src/chat/dto/room-dto';

config();

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profile: ProfilesService,
		private readonly notificationService: NotificationService,
		private readonly notificationGateway: NotificationGateway,
    // private readonly chatservice: ChatService
  ) {}

  async resetPassword(user: any, old: string, newPass: string) {
    const isMatch = await bcrypt.compareSync(old, user.password);
    if (!isMatch)
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    const rounds = await parseInt(process.env.BCRYPT_ROUNDS);
    const HashedPassword = await bcrypt.hashSync(newPass, rounds);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: HashedPassword,
      },
    });
    return updatedUser;
  }

  async CreateUserIntra(reqData: CreateUserDtoIntra) {
    const userExist = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: reqData.email,
          },
          {
            intraid: reqData.intraid,
          },
          {
            username: reqData.username,
          }
        ],
      },
    });
    if (userExist)
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    const user = await this.prisma.user.create({
      data: {
        intraid: reqData.intraid,
        email: reqData.email,
        username: reqData.username,
        profile: {
          create: {},
        },
      },
    });
    if (!user)
      throw new HttpException(
        'User creation failed: Unprocessable Entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return user;
  }

  async CreateUserGoogle(data: any) {
    const userExist = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            googleId: data.googleId,
          },
          {
            email: data.email,
          },
          {
            username: data.username,
          }
        ],
      },
    });
    if (userExist)
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    const user = await this.prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,
        username: data.username,
        profile: {
          create: {},
        },
      },
    });
    if (!user)
      throw new HttpException(
        'User creation failed: Unprocessable Entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return user;
  }

  async UpdateUser(user_id: number, data: updateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    let secret = null;
    if (data.twoFactor && data.twoFactor == true) {
      secret = authenticator.generateSecret();
      // const otpauth = authenticator.keyuri(user.email, 'pinje-ponge', secret);
      // const generatedQR = await toDataURL(otpauth);
    } else {
      secret = null;
    }
      const updatedUser = await this.prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          ...data,
          twoFactorSecret: secret,
        },
      });
      return updatedUser;
  }

  async CreateUserLocal(data: SignUpDto) {
			const userExist = await this.prisma.user.findFirst({
        where: {
          OR : [
            {
              email: data.email,
            },
            {
              username: data.username,
            }
          ]
        }
			});
			if (userExist)
				throw new HttpException('User already exist', HttpStatus.CONFLICT);
      const rounds = await parseInt(process.env.BCRYPT_ROUNDS);
      const HashedPassword = await bcrypt.hashSync(data.password, rounds);
      const user = await this.prisma.user.create({
        data: {
          password: HashedPassword,
          email: data.email,
          username: data.username,
          profile: { 
            create: {},
          }
        }
      })
      if (!user) {
        throw new HttpException('User creation failed: Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      return user;
}

  async FindAllUsers(
    @Param('id', ParseIntPipe) id: number,
    params: PaginationLimitDto,
    search: string
  ) {
    const users = await this.prisma.user.findMany({
      where : {
        AND : [{
            OR : search ? [
              { username : { contains : search  , mode : 'insensitive'} },
            ] : {}
          }
        ]
      },
      include : {
        profile: true,
      },
      ...params,
    });
    if (!users)
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    // Remove sensitive information using map and object destructuring
    const sanitizedUsers = users.map(({ password, twoFactorSecret, ...user }) => user);
    return sanitizedUsers;
  }

  async FindUserByID(@Param('user_id', ParseIntPipe) user_id: number, searchid: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        AND: [
          {
            id: searchid,
          },
          {
            NOT: {
              OR: [
                { blockedBy: { some: { blockerId: user_id, blockedId: searchid }  } },
                { blocking: { some: { blockerId: searchid, blockedId: user_id} }  },
              ],
            },
          },
        ],
      },
      include: {
        profile: true,
      },
    });
    if (user == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    delete user.password;
    delete user.twoFactorSecret;
    return user;
  }
  
  giveRandomAvatar() {
    const avatar = [
      "path://shinra.png",
      "path://stewie.png",
      "path://escanor.png",
    ];
    return avatar[Math.floor(Math.random() * avatar.length)];
  }


  async FindUserByIntraId(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { intraid: id },
    });
    return user;
  }

  async FindUserByGoogleId(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { googleId: id },
    });
    return user;
  }

  async FindUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async RemoveUsers(id: number) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userExist)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const profile = await this.prisma.profile.delete({
      where: { userid: id },
    });
    const user = await this.prisma.user.delete({
      where: { id: id },
      include: {
        profile: true,
      }
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async getQRCode(id: number) {
    console.log('id from user service : ', id);
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user.twoFactor == false) {
      throw new HttpException(
        'Two factor is not enabled',
        HttpStatus.NOT_FOUND,
      );
    }
    const secret = user.twoFactorSecret;
    const otpauth = authenticator.keyuri(user.email, 'pinje-ponge', secret);
    const generatedQR = await toDataURL(otpauth);
    return generatedQR;
  }

  async getCurrentUser(request: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: parseInt(request.user.sub),
      },
      include: {
        friendOf: true,
        blocking: true,
        pendingRequest: true,
        sentRequest: true,
        profile: true,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    delete user.password;
    // delete user.twoFactorSecret;
    return user;
  }

  async FindAllBlockedUsers(user_id: number) {
    const blockedList = await this.prisma.userBlocking.findMany({
      where: { blockerId: user_id },
        include:{
          blocked: {
            select: {
              username: true,
              profile: true,
            }
          }
        }
    });

    return blockedList;
  }

  async BlockUser(user_id: number, data: blockAndUnblockUserDto) {
    const blockedUser = await this.prisma.user.findUnique({
      where: { id: data.id },
    });
    if (!blockedUser)
      // if blocked user not found
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (blockedUser.id == user_id)
      // if want to block himself
      throw new HttpException(
        "You can't block yourself",
        HttpStatus.BAD_REQUEST,
      );

    const ifAlready = await this.prisma.userBlocking.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: user_id,
          blockedId: data.id,
        },
      },
    });
    if (ifAlready)
      // if already blocked
      throw new HttpException('User already blocked', HttpStatus.BAD_REQUEST);

    await this.prisma.userBlocking.create({
      data: {
        blockerId: user_id,
        blockedId: data.id,
      },
    });
    return 'You have blocked this user';
  }

  async UnBlockFriend(user_id: number, data: blockAndUnblockUserDto) {
    const blockedUser = await this.prisma.user.findUnique({
      where: { id: data.id },
    });
    if (!blockedUser)
      // if blocked user not found
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const ifAlready = await this.prisma.userBlocking.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: user_id,
          blockedId: data.id,
        },
      },
    });
    if (!ifAlready)
      // if user not blocked
      throw new HttpException('User not blocked', HttpStatus.BAD_REQUEST);

    const user = await this.prisma.userBlocking.delete({
      where: {
        blockerId_blockedId: {
          blockerId: user_id,
          blockedId: data.id,
        },
      },
    });

    return 'You have unblocked this user';
  }

  async FindAllFriends(
    _currentUser: number,
    @Param('user_id', ParseIntPipe) user_id: number,
    params: PaginationLimitDto,
  ) {
    const listofFriends = await this.prisma.friendship.findMany({
      where: {
        userId: user_id,
      },
      select: {
        friend: {
          include: {
            profile: true,
          },
        },
      },
    });

    const sanitizedFriends = listofFriends.map(({ friend }) => {
      const { password, twoFactorSecret, ...sanitizedFriend } = friend;
      return sanitizedFriend;
    });
    return sanitizedFriends;
  }

  async Unfriend(
    @Param('user_id', ParseIntPipe) user_id: Number,
    data: any,
  ): Promise<any> {
    const getFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            userId: user_id as number,
            friendId: data.id,
          },
          {
            userId: data.id,
            friendId: user_id as number,
          },
        ],
      },
    });
    if (getFriendship == null)
      throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);

    const deleteFriend = await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          {
            userId: user_id as number,
            friendId: data.id,
          },
          {
            userId: data.id,
            friendId: user_id as number,
          },
        ],
      },
    });
    return 'Friendship deleted';
  }

  async CancelFriendRequest(user_id: number, data: FriendsActionsDto) {
    const getFriendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: user_id,
          receiverId: data.id,
        },
      },
    });

    if (getFriendRequest == null)
      throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);

    const req_receiver = await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: user_id,
          receiverId: data.id,
        },
      },
    });

    return 'Friend request canceled';
  }

  async DeclineFriendRequest(user_id: number, data: FriendsActionsDto) {
    const getFriendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: data.id,
          receiverId: user_id,
        },
      },
    });
    if (getFriendRequest == null)
      throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);
    await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: data.id,
          receiverId: user_id,
        },
      },
    });
    return 'Friend request declined';
  }

  async AcceptFriendRequest(
    @Param('user_id', ParseIntPipe) user_id: number,
    data: FriendsActionsDto,
  ) {
    const getFriendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: data.id,
            receiverId: user_id,
          },
          {
            senderId: user_id,
            receiverId: data.id,
          },
        ],
      },
    });
    if (getFriendRequest == null)
      throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);

    await this.prisma.friendship.createMany({
      data: [
        {
          userId: user_id,
          friendId: data.id,
        },
        {
          userId: data.id,
          friendId: user_id,
        },
      ],
    });

    await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: data.id,
          receiverId: user_id,
        },
      },
    });

    await this.prisma.chatRoom.create({
      data: {
        name: "",
        roomType: RoomType.DM,
        members: {
          create: [
            {
              user: { connect: { id: data.id } },
              role: ChatRole.MEMBER,
            },
            {
              user: { connect: { id: user_id } },
              role: ChatRole.MEMBER,
            },
          ],
        },
      },
    });

    this.notificationService.create({
      senderId: user_id,
      receiverId: data.id,
      type: NotificationType.FRIEND_REQUEST_ACCEPTED
    })
    return 'Friend request accepted';
  }

  async SentFriendRequest(user_id: number, data: FriendsActionsDto) {
    const newFriendProfile = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!newFriendProfile || newFriendProfile.id === user_id)
      throw new HttpException('No profile with this id', HttpStatus.NOT_FOUND);

    const createRequest = await this.prisma.friendRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId: user_id,
          receiverId: data.id,
        },
      },
      update: {},
      create: {
        senderId: user_id,
        receiverId: data.id,
      },
    });
    this.notificationService.create({
      senderId: user_id,
      receiverId: data.id,
      type: NotificationType.FRIEND_REQUEST
    })
    return 'Friend Request has been sent';
  }
}
