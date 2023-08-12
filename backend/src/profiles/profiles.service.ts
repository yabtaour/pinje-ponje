import { Inject, Injectable } from '@nestjs/common';
import { log } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Injectable()
export class ProfilesService {
  constructor(readonly prisma: PrismaService ) {}



  // for less lines i can use the id directly without looking for profile
  async FindAllProfiles(_id: number, search: string) {
    if (!_id) {
      return "Profile id is undefined";
    }
    const userProfiles = await this.prisma.profile.findUnique({
      where: { userid: _id },
    });
    if (!userProfiles) {
      return "No profile with this id.";
    }
    const profiles = await this.prisma.profile.findMany({
      where : {
        AND : [
          {
            NOT : {
              OR : [
                { blockedBy : { some : { id : userProfiles.id } } },
                { blocking : { some : { id : userProfiles.id } } }
              ]
            }
          }, {
            OR : search ? [
              !isNaN(+search) ? { userid : +search } : {},
              { login : { contains : search  , mode : 'insensitive'} },
            ] : {}
          }
        ]
      },

      include: {
        pendingRequest: true,
        sentRequest: true,
        blockedBy: true,
        blocking: true,
      },
    });
    return profiles;
  }

  async FindProfileById(_reqid: number , id: number) {
    if (!_reqid || !id) {
      return "Profile id is undefined.";
    }
    console.log("id: ", id);
    console.log("_reqid: ", _reqid);

    const profile = await this.prisma.profile.findUnique({
      where: { userid: id },
      include: {
        pendingRequest: true,
        sentRequest: true,
        blockedBy: true,
        blocking: true,
      },
    });

    if (!profile) {
      return "No profile with this id.";
    }

    const isBlocked = profile.blockedBy.find((element) => element.id === _reqid);
    const isBlocking = profile.blocking.find((element) => element.id === _reqid);
    if (isBlocked || isBlocking) {
      return "You are blocked by this user.";
    }
    return profile;
  }

  async FindAllFriends(_id: number) {
    const userFriends = await this.prisma.profile.findUnique({
      where: { id: _id },
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
    });
    if (!userFriends || !allFriends) {
      return "No profile with this id";
    }
    return allFriends;
  }

  async SentFriendsRequest(_id: number, data: any) {
    
    if (!_id || !data.id) {
      return "Profile id is undefined";
    }

    const newFriendProfile = await this.prisma.profile.findUnique({
      where: { userid: data.id },
    });
    
    if (!newFriendProfile) {
      return "No profile with this id";
    }
    const sender = await this.prisma.profile.update({
      where: { id: _id },
      data: {
        sentRequest: {
          connect: { id: data.id }
        }
      },
    });
    return sender;
  }

  async AccepteFriendRequest(_id: number, data: any) {

    if (!_id || !data.id) {
      return "Profile id is undefined";
    }
    const otheruserFind = await this.prisma.profile.findUnique({
      where: { id: data.id },
      include: { sentRequest: true },
    });
    if (otheruserFind){
      const existingRequest = otheruserFind.sentRequest.find((element) => element.id === _id);
      if (!existingRequest) {
        return "No request with this id";
      }

      const otheruser = await this.prisma.profile.update({
        where: { id: data.id },
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
          where: { id: _id },
          data: {
            Friends: {
              push : data.id
            }
          },
        });
      }
    }
  }


  async DeclineFriendRequest(_id: number, data: any) {
    const inviter = await this.prisma.profile.findUnique({
      where: { id: data.id },
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
      where: { id: _id },
      data: {
        pendingRequest: {
          disconnect: { id: data.id } 
        }
      },
    });
    return req_sender;
  }

  async CancelFriendRequest(_id: number, data: any) {
    const receiver = await this.prisma.profile.findUnique({
      where: { id: data.id },
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
      where: { id: _id },
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
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (profile) {
      const updatedFriends = profile.Friends.filter((friend) => friend !== friendId);

      await this.prisma.profile.update({
        where: { id: profileId },
        data: {
          Friends: {
            set: updatedFriends,
          },
        },
      });
    }
  }

  async RemoveFriend(profileId: number, data: any): Promise<any> {
    const friendProfile = await this.prisma.profile.findUnique({
      where: { id: data.id },
    });

    if (!friendProfile) {
      return "No profile with this id";
    }

    await this.removeFromFriendList(profileId, data.id);
    await this.removeFromFriendList(data.id, profileId);

    return friendProfile;
  }

  async FindAllBlockedUsers(_id: number) {
    const user = await this.prisma.profile.findUnique({
      where: { id: _id },
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
    if (!data.id)
      return "id is undefined"
    const blockedUser = await this.prisma.profile.findUnique({
        where : { id: data.id},
    });
    if (!blockedUser)
      return "User Not Found"
    const userProfile = await this.prisma.profile.update({
      where: { id: _id},
      data: {
        blocking: {
          connect: { id: data.id }
        }
      }
    })
    return userProfile;
  }

  async UnBlockFriend(_id: number, data: any) {
    if (!data.id)
      return "id is undefined"
    const blockedUser = await this.prisma.profile.findUnique({
      where : { id: data.id}
    })
    if (!blockedUser)
      return "User Not Found"
    const userProfile = await this.prisma.profile.update({
      where: { id: _id},
      data: {
        blocking: {
          disconnect: { id: data.id }
        }
      }
    })
    return userProfile;
  }

  async RemoveProfiles(id: number) {
    const user = await this.prisma.profile.delete({
      where: { id: id },
    });
    return user;
  }


  // this section for update profile

  async getAvatar(_id: number) {
    if (!_id) {
      return "Profile id is undefined";
    }
    const user = await this.prisma.profile.findUnique({
      where: { id: _id },
      select: {
        avatar: true,
      },
    });
    return user;
  }

  async uploadAvatar(_id: number, file: any) {
    if (!file || !file.path) {
      return "No file uploaded";
    }
    if (!_id) {
      return "Profile id is undefined";
    }
    const user = await this.prisma.profile.update({
      where: { id: _id },
      data: {
        avatar: file.path,
      },
    });
    return user;
  }

  async deleteAvatar(_id: number) {
    if (!_id) {
      return "Profile id is undefined";
    }
    const user = await this.prisma.profile.update({
      where: { id: _id },
      data: {
        avatar: null,
      },
    });
    return user;
  }

  async updateProfile(_id: number, data: any) {
    if (!_id) {
      return "Profile id is undefined";
    }
    _id = 62;
    const user = await this.prisma.profile.update({
      where: { id: _id },
      data: {
        ...data,
      },
    });
    if (!user) {
      return "No profile with this id";
    }
    return user;
  }
}


