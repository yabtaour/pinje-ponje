import { BadRequestException, Inject, Injectable, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { log } from 'console';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { de, fi, th } from '@faker-js/faker';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDto } from 'src/user/dto/user.dto';
import { promises } from 'dns';
import { PaginationLimitDto } from 'src/chat/chat.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(
		@Inject(forwardRef(() => NotificationService))
		private readonly notificationService: NotificationService,
		private readonly prisma: PrismaService
	) {}

  // async FindAllProfiles(_id: number, search: string) {
  //   console.log("FindAllProfiles: ", search);
  //   const profiles = await this.prisma.profile.findMany({
  //     where : {
  //       AND : [
  //         {
  //           NOT : {
  //             OR : [
  //               { blockedBy : { some : { id : _id } } },
  //               { blocking : { some : { id : _id } } }
  //             ]
  //           }
  //         }, {
  //           OR : search ? [
  //             !isNaN(+search) ? { userid : +search } : {},
  //             { login : { contains : search  , mode : 'insensitive'} },
  //           ] : {}
  //         }
  //       ],
  //     },
  //     include: {
  //       pendingRequest: true,
  //       sentRequest: true,
  //       blocking: true,
  //     },
  //   });
  //   return profiles;
  // }

  async FindProfileById(_reqid: number , id: number) {
    const isBlocked = await this.isBlockby(_reqid, id);
    const isBlockedby = await this.isBlockby(id, _reqid);
    if (isBlocked || isBlockedby)
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    const profile = await this.prisma.profile.findUnique({
      where: { userid: id },
      include: {
        pendingRequest: true,
        sentRequest: true,
        blockedBy: true,
        blocking: true,
      },
    });
    if (!profile)
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    profile.blockedBy = undefined;
    profile.blocking = undefined;
    profile.Friends = undefined;
    const Object = {
      ...profile,
      FriendsList: await this.FindAllFriends(_reqid, id , {}),
    }
    return Object;
  }


  async FindAllFriends(_currentUser: number, _id: number, params: PaginationLimitDto) {
    const isBlocked = await this.isBlockby(_currentUser, _id);
    const isBlockedby = await this.isBlockby(_id, _currentUser);
    if (isBlocked || isBlockedby)
      return [];
    const userFriends = await this.prisma.profile.findUnique({
      where: { userid: _id },
          select: {
            Friends: true,
          },
    });
    const allFriends = await this.prisma.profile.findMany({
      where: {
        id: {
          in: userFriends.Friends,
        },
      },
      select: {
        id: true,
        avatar: true,
        username: true,
      },
      ...params,
    });
    if (!userFriends || !allFriends)
      throw new HttpException('No profile with this id', HttpStatus.NOT_FOUND);
    const filterdFriends =  await this.filterFriendsByBlockingStatus(allFriends, _currentUser);
    return filterdFriends;
  }

  async SentFriendsRequest(_id: number, data: any) {
    console.log("SentFriendsRequest: ", data);
    
    if (!_id || !data.id)
      throw new BadRequestException("Profile id is undefined");
    const newFriendProfile = await this.prisma.profile.findUnique({
      where: { userid: data.id },
    });
    
    if (!newFriendProfile)
      throw new HttpException('No profile with this id', HttpStatus.NOT_FOUND);
    const sender = await this.prisma.profile.update({
      where: { userid: _id },
      data: {
        sentRequest: {
          connect: { id: data.id }
        }
      },
    });
		this.notificationService.create({
			senderId: _id,
			receiverId: data.id,
			type:	NotificationType.FRIEND_REQUEST,
		})
    return sender;
  }

  async AccepteFriendRequest(_id: number, data: {senderId: number}) {
    console.log("AccepteFriendRequest: ", data);
    if (!_id || !data.senderId) {
      return "Profile id is undefined";
    }
    const otheruserFind = await this.prisma.profile.findUnique({
      where: { userid: data.senderId },
      include: { sentRequest: true },
    });
    if (otheruserFind){
      const existingRequest = otheruserFind.sentRequest.find((element) => element.id === _id);
      if (!existingRequest) {
        return "No request with this id";
      }

      const otheruser = await this.prisma.profile.update({
        where: { userid: data.senderId },
        data: {
          sentRequest: {
            disconnect: { id: _id }
          },
          Friends: {
            push : _id
          }
        },
      });
      const buttonclicker = await this.prisma.profile.findUnique({
        where: { id: _id },
      });
      if (buttonclicker) {
        const updateclickerProfile = await this.prisma.profile.update({
          where: { userid: _id },
          data: {
            Friends: {
              push : data.senderId
            }
          },
        });
      }
			this.notificationService.create({
				senderId: _id,
				receiverId: data.senderId,
				type:	NotificationType.FRIEND_REQUEST_ACCEPTED,
			})
    }
  }


  async DeclineFriendRequest(_id: number, data: any) {
    console.log("DeclineFriendRequest: ", data);
    const inviter = await this.prisma.profile.findUnique({
      where: { userid: data.id },
      include: { sentRequest: true },
    });
    if (!inviter) {
      return "No profile with this id";
    }

    const existingRequest = inviter.sentRequest.find((element) => element.id === _id);
    if (!existingRequest) {
      return "No request with this id";
    }
    const req_sender = await this.prisma.profile.update({
      where: { userid: _id },
      data: {
        pendingRequest: {
          disconnect: { id: data.id } 
        }
      },
    });
    return req_sender;
  }

  async CancelFriendRequest(_id: number, data: any) {
    console.log("CancelFriendRequest: ", data);
    const receiver = await this.prisma.profile.findUnique({
      where: { userid: data.id },
      include: { pendingRequest: true },
    });
    if (!receiver) {
      return "No profile with this id";
    }
    
    const existingRequest = receiver.pendingRequest.find((element) => element.id === _id);
    if (!existingRequest) {
      return "No request with this id";
    }
    const req_receiver = await this.prisma.profile.update({
      where: { userid: _id },
      data: {
        sentRequest: {
          disconnect: { id: data.id }
        }
      },
    });
    console.log("req_receiver: ", req_receiver);
    return req_receiver;
  }

  async removeFromFriendList(profileId: number, friendId: number): Promise<void> {
    console.log("removeFromFriendList: ", profileId, friendId);
    const profile = await this.prisma.profile.findUnique({
      where: { userid: profileId },
    });

    if (profile) {
      const updatedFriends = profile.Friends.filter((friend) => friend !== friendId);

      await this.prisma.profile.update({
        where: { userid: profileId },
        data: {
          Friends: {
            set: updatedFriends,
          },
        },
      });
    }
  }

  async RemoveFriend(profileId: number, data: any): Promise<any> {
    console.log("RemoveFriend: ", data);
    const friendProfile = await this.prisma.profile.findUnique({
      where: { userid: data.id },
    });

    if (!friendProfile) {
      return "No profile with this id";
    }

    await this.removeFromFriendList(profileId, data.id);
    await this.removeFromFriendList(data.id, profileId);

    return friendProfile;
  }

  async FindAllBlockedUsers(_id: number) {
    console.log("FindAllBlockedUsers: ", _id);
    const user = await this.prisma.profile.findUnique({
      where: { userid: _id },
      select: {
        blocking: true,
      },
    });
    if (!user) {
      return "No profile with this id.";
    }
    return user;
  }


  async BlockFriend(_id: number, data: any) {
    console.log("BlockFriend: ", data);
    if (!data.id)
      return "id is undefined"
    const blockedUser = await this.prisma.profile.findUnique({
        where : { userid: data.id},
    });
    if (!blockedUser)
      return "User Not Found"
    const userProfile = await this.prisma.profile.update({
      where: { userid: _id},
      data: {
        blocking: {
          connect: { id: data.id }
        }
      }
    })
    return userProfile;
  }

  async UnBlockFriend(_id: number, data: any) {
    console.log("UnBlockFriend: ", data);
    if (!data.id)
      return "id is undefined"
    const blockedUser = await this.prisma.profile.findUnique({
      where : { userid: data.id}
    })
    if (!blockedUser)
      return "User Not Found"
    const userProfile = await this.prisma.profile.update({
      where: { userid: _id},
      data: {
        blocking: {
          disconnect: { id: data.id }
        }
      }
    })
    return userProfile;
  }

  async RemoveProfiles(id: number) {
    console.log("RemoveProfiles: ", id);
    const user = await this.prisma.profile.delete({
      where: { userid: id },
    });
    return user;
  }

  async getAvatar(_id: number) {
    console.log("getAvatar: ", _id);
    if (!_id) {
      return "Profile id is undefined";
    }
    const user = await this.prisma.profile.findUnique({
      where: { userid: _id },
      select: {
        avatar: true,
      },
    });
    return user;
  }

  async uploadAvatar(_id: number, file: any) {
    console.log("file: ", file);
    if (!_id) {
      return "Profile id is undefined";
    }
    if (!file || !file.path || !file.filename) {
            return "File is undefined";
    }
    const user = await this.prisma.profile.update({
      where: { userid: _id },
      data: {
        avatar: file.path,
      },
    });
    return user;
  }

  async deleteAvatar(_id: number) {
    console.log("deleteAvatar: ", _id);
    if (!_id) {
      return "Profile id is undefined";
    }
    const user = await this.prisma.profile.update({
      where: { userid: _id },
      data: {
        avatar: null,
      },
    });
    return user;
  }

  async updateProfile(_currentUser: UserDto, data: any) {
    console.log("updateProfile: ", data);
    console.log("data: ", data);
    const user = await this.prisma.profile.update({
      where: { userid: +_currentUser.sub },
      data: {
        ...data,
      },
    });
    if (!user) {
      return "No profile with this id";
    }
    return user;
  }

  async isBlockby(_id: number, id: number) : Promise<boolean>{
    const user = await this.prisma.profile.findUnique({
      where: { userid: _id },
      select: {
        blockedBy: true,
      },
    });
    if (!user) {
      throw new HttpException('No profile with this id', HttpStatus.NOT_FOUND);
    }
    const blocking = user.blockedBy.find((element) => element.id === id);
    if (blocking)
      return true;
    return false;
  }


  async filterFriendsByBlockingStatus(
    friends: any[],
    currentUser: number
  ): Promise<any> {
    const nonBlockedFriends = await Promise.all(
      friends.map(async (friend) => {
        const isBlockedByFriend = await this.isBlockby(friend.id, currentUser);
        const isBlockedByCurrentUserFriend = await this.isBlockby(currentUser, friend.id);
        if (!isBlockedByFriend && !isBlockedByCurrentUserFriend) {
          return friend;
        }
        return null;
      })
    );
    const filteredFriends = nonBlockedFriends.filter((friend) => friend !== null);
    return filteredFriends;
  }
}
