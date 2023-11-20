import {
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateUserDtoIntra } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { PaginationLimitDto } from 'src/chat/chat.service';
import { blockAndUnblockUserDto } from './dto/blockAndUnblock-user.dto';
import { FriendsActionsDto } from './dto/FriendsActions-user.dto';
import { toRaw } from 'vue';

config();

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profile: ProfilesService,
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
    const userExist = await this.prisma.user.findUnique({
      where: {
        email: reqData.email,
      },
    });
    if (userExist)
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    const user = await this.prisma.user.create({
      data: {
        intraid: reqData.intraid,
        email: reqData.email,
        profile: {
          create: {
            username: reqData.profile.username,
            avatar: reqData.profile.avatar,
          },
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
    const userExist = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (userExist)
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    const user = await this.prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,
        profile: {
          create: {
            username: data.profile.username,
            avatar: data.profile.avatar,
          },
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

  async CreateUserLocal(data: any) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (userExist)
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    const rounds = await parseInt(process.env.BCRYPT_ROUNDS);
    const HashedPassword = await bcrypt.hashSync(data.password, rounds);
    const user = await this.prisma.user.create({
      data: {
        intraid: 33,
        password: HashedPassword,
        email: data.email,
        profile: {
          create: {
            username: data.username,
            avatar: 'data.profile.avatar',
          },
        },
      },
    });
    if (!user) {
      throw new HttpException(
        'User creation failed: Unprocessable Entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return user;
  }

  // this only update User Level : Email : Hashpassword : twofactor
  async UpdateUser(user_id: number, data: updateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (data.password) {
      const rounds = await parseInt(process.env.BCRYPT_ROUNDS);
      const HashedPassword = await bcrypt.hashSync(data.password, rounds);
      data.password = HashedPassword;
    }
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        ...data,
        profile: {
          update: {
            ...data.profile,
          },
        },
      },
    });
    return updatedUser;
  }

  async FindAllUsers(
    @Param('id', ParseIntPipe) id: number,
    params: PaginationLimitDto,
  ) {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        status: true,
        twoFactor: true,
        profile: true,
      },
      ...params,
    });
    if (!users)
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    return users;
  }

  async FindUserByID(@Param('user_id', ParseIntPipe) user_id: number, searchid: number) {
    const user = await this.prisma.user.findMany({
      where: {
        AND: [
          {
            id: searchid as number,
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
      select: {
        id : true,
        email: true,
        twoFactor: true,
        profile: true,
      },
    });
    if (user.length == 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
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
    // try {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
    // } catch (error) {
    // 	throw new NotFoundException(error);
    // }
  }

  async RemoveUsers(id: number) {
    // try {
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
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
    // } catch (error) {
    // 	throw new InternalServerErrorException(error);
    // }
  }

  async getQRCode(id: number) {
    // try {
    console.log('id from user service : ', id);
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    console.log('user from user service : ', user);
    if (user.twoFactor == false) {
      console.log('Two factor is not enabled');
      throw new HttpException(
        'Two factor is not enabled',
        HttpStatus.NOT_FOUND,
      );
    }
    console.log('Two factor is enabled');
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
        profile: true,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    delete user.password;
    delete user.twoFactorSecret;
    return user;
  }

  async FindAllBlockedUsers(_id: number) {
    const blockedList = await this.prisma.userBlocking.findMany({
      where: { blockerId: _id },
      select: {
        blocked: {
          select: {
            id: true,
            profile: {
              select: {
                avatar: true,
                username: true,
              },
            },
          },
        },
      },
    });
    return blockedList;
  }

  async BlockUser(_id: number, data: blockAndUnblockUserDto) {
    const blockedUser = await this.prisma.user.findUnique({
      where: { id: data.id },
    });
    if (!blockedUser)
      // if blocked user not found
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (blockedUser.id == _id)
      // if want to block himself
      throw new HttpException(
        "You can't block yourself",
        HttpStatus.BAD_REQUEST,
      );

    const ifAlready = await this.prisma.userBlocking.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: _id,
          blockedId: data.id,
        },
      },
    });
    if (ifAlready)
      // if already blocked
      throw new HttpException('User already blocked', HttpStatus.BAD_REQUEST);

    await this.prisma.userBlocking.create({
      data: {
        blockerId: _id,
        blockedId: data.id,
      },
    });

    return 'You have blocked this user';
  }

  async UnBlockFriend(_id: number, data: blockAndUnblockUserDto) {
    const blockedUser = await this.prisma.user.findUnique({
      where: { id: data.id },
    });
    if (!blockedUser)
      // if blocked user not found
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const ifAlready = await this.prisma.userBlocking.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: _id,
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
          blockerId: _id,
          blockedId: data.id,
        },
      },
    });

    return 'You have unblocked this user';
  }

  async FindAllFriends(
    _currentUser: number,
    @Param('user_id', ParseIntPipe) _id: number,
    params: PaginationLimitDto,
  ) {
    const listofFriends = await this.prisma.friendshipTest.findMany({
      where: {
        userId: _id,
      },
      select: {
        friend: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
    });
    return listofFriends;
  }

  async Unfriend(
    @Param('user_id', ParseIntPipe) user_id: Number,
    data: any,
  ): Promise<any> {
    const getFriendship = await this.prisma.friendshipTest.findMany({
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
    console.log(getFriendship);
    if (getFriendship.length == 0)
      throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);

    const deleteFriend = await this.prisma.friendshipTest.deleteMany({
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

  async CancelFriendRequest(_id: number, data: FriendsActionsDto) {
    const getFriendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: _id,
          receiverId: data.id,
        },
      },
    });

    if (getFriendRequest == null)
      throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);

    const req_receiver = await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: _id,
          receiverId: data.id,
        },
      },
    });

    return 'Friend request canceled';
  }

  async DeclineFriendRequest(_id: number, data: FriendsActionsDto) {
    const getFriendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: data.id,
          receiverId: _id,
        },
      },
    });
    if (getFriendRequest == null)
      throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);
    await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: data.id,
          receiverId: _id,
        },
      },
    });
    return 'Friend request declined';
  }

  async AcceptFriendRequest(
    @Param('user_id', ParseIntPipe) user_id: Number,
    data: FriendsActionsDto,
  ) {
    const getFriendRequest = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            senderId: data.id,
            receiverId: user_id as number,
          },
          {
            senderId: user_id as number,
            receiverId: data.id,
          },
        ],
      },
    });
    if (getFriendRequest.length == 0)
      throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);

    await this.prisma.friendshipTest.createMany({
      data: [
        {
          userId: user_id as number,
          friendId: data.id,
        },
        {
          userId: data.id,
          friendId: user_id as number,
        },
      ],
    });

    await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: data.id,
          receiverId: user_id as number,
        },
      },
    });

    return 'Friend request accepted';
  }

  async SentFriendRequest(_id: number, data: FriendsActionsDto) {
    const newFriendProfile = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!newFriendProfile || newFriendProfile.id === _id)
      throw new HttpException('No profile with this id', HttpStatus.NOT_FOUND);

    const createRequest = await this.prisma.friendRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId: _id,
          receiverId: data.id,
        },
      },
      update: {},
      create: {
        senderId: _id,
        receiverId: data.id,
      },
    });

    return 'Friend Request has been sent';
  }

  // Not routes functions
  async isBlockby(_id: number, id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: _id },
      select: {
        blockedBy: true,
      },
    });
    if (!user) {
      throw new HttpException('No profile with this id', HttpStatus.NOT_FOUND);
    }
    // const blocking = user.blockedBy.find((element) => element.id === id);
    // if (blocking)
    //   return true;
    return false;
  }
}
