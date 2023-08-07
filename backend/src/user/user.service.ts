import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilesService } from 'src/profiles/profiles.service';

    // need Protection for this route
    // need to check if the user is already exist
    // need to check if the profile is already exist
    // need to check if the email is already exist
    // friendshipes need to be protected from blocked and pending users


    // to do:
    // ulpoading avatar's
    // guards and middlewares
@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService, readonly profile: ProfilesService) {}



  async CreateUser(reqData: any) {
    // const userFind = await this.prisma.user.findUnique({
    //   where: { id: reqData.id },
    // });
    // if (userFind) {
    //   return "User already exist";
    // }
    try {

      const user = await this.prisma.user.create({
        data: {
          // id : reqData.id,
          intraid: reqData.intraid,
          Hashpassword: reqData.Hashpassword,
          email: reqData.email,
          profile: {
            create: {
              // id: reqData.profile.id,
              username: reqData.profile.username,
              avatar: reqData.profile.avatar,
              login: reqData.profile.login,
            },
          }
        }
      })
      return user;
    } catch (error) {
      console.log(error);
      return "Error: User Already Exist";
    }
  }

  // async FindProfileById(id: number) {
  //   const profile = await this.prisma.profile.findUnique({
  //     where: { id : id} ,
  //   });
  //   return profile;
  // }

  // async FindAllProfiles() {
  //   const user = await this.prisma.profile.findMany({
  //     include: {
  //       pendingRequest: true,
  //       sentRequest: true,
  //     },
  //   });
  //   return user;
  // }

  async FindAllUsers() {
    const user = await this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    return user;
  }

  // async AccepteFriendRequest(data: any) {
  //   const user = await this.prisma.profile.findUnique({
  //     where: { id: data.id },
  //     include: { pendingRequest: true },
  //   });
  //   if (user){
  //     const existingRequest = user.pendingRequest.find((element) => element.id === data.senderID);
  //     if (!existingRequest) {
  //       return "No request with this id";
  //     }
  //     const updateSender = await this.prisma.profile.update({
  //       where: { id: data.id },
  //       data: {
  //         pendingRequest: {
  //           disconnect: { id: data.senderID }
  //         },
  //         Friends: {
  //           push : data.senderID
  //         }
  //       },
  //     });
  //     const senderProfile = await this.prisma.profile.findUnique({
  //       where: { id: data.senderID },
  //     });
  //     if (senderProfile) {
  //       const updatesenderProfile = await this.prisma.profile.update({
  //         where: { id: data.senderID },
  //         data: {
  //           sentRequest: {
  //             disconnect: { id: data.id }
  //           },
  //           Friends: {
  //             push : data.id
  //           }
  //         },
  //       });
  //     }
  //   }
  // }

  // async SentFriendsInvitation(data: any) {
    
  //   const newFriendProfile = await this.prisma.profile.findUnique({
  //     where: { id: data.newFriendID },
  //   });
    
  //   if (!newFriendProfile) {
  //     return "No profile with this id";
  //   }
  //   const sender = await this.prisma.profile.update({
  //     where: { id: data.senderID },
  //     data: {
  //       sentRequest: {
  //         connect: { id: data.newFriendID }
  //       }
  //     },
  //   });
  //   return sender;
  // }

  // async DeclineFriendRequest(data: any) {
  //   const newFriendProfile = await this.prisma.profile.findUnique({
  //     where: { id: data.newFriendID },
  //   });
  //   if (!newFriendProfile) {
  //     return "No profile with this id";
  //   }
  //   const sender = await this.prisma.profile.update({
  //     where: { id: data.senderID },
  //     data: {
  //       sentRequest: {
  //         disconnect: { id: data.newFriendID }
  //       }
  //     },
  //   });
  //   return sender;
  // }

  // async RemoveFriend(data: any) {
  //   const newFriendProfile = await this.prisma.profile.findUnique({
  //     where: { id: data.id },
  //   });
  //   if (!newFriendProfile) {
  //     return "No profile with this id";
  //   }
  //   const sender = await this.prisma.profile.update({
  //     where: { id: data.friendID },
  //     data: {
  //       Friends: {
  //         set: newFriendProfile.Friends.filter((element) => element !== data.id)
  //       }
  //     },
  //   });
  //   const newFriend = await this.prisma.profile.update({
  //     where: { id: data.id },
  //     data: {
  //       Friends: {
  //         set: newFriendProfile.Friends.filter((element) => element !== data.friendID)
  //       }
  //     },
  //   });
  //   return sender;
  // }


  // // Working FLAG_HERE
  // async BlockFriend(data: any) {
  //   const blockedUser = await this.prisma.profile.findUnique({
  //       where : { id: data.blockedId},
  //   });
  //   if (!blockedUser)
  //     return "User Not Found"
  //   const userProfile = await this.prisma.profile.update({
  //     where: { id: data.id},
  //     data: {
  //         blocking: {
  //           connect: { id: data.blockedId }
  //         },
  //     },
  //   });
  //   return this.FindUserByID(data.id);
  // }

  // async UnBlockFriend(data: any) {
  //   const blockedUser = await this.prisma.profile.findUnique({
  //     where : { id: data.blockedID}
  //   })
  //   if (!blockedUser)
  //   return "User Not Found"
  //   const userProfile = await this.prisma.profile.update({
  //     where: { id: data.id},
  //     data: {
  //       blocking: {
  //         disconnect: { id: data.blockedId }
  //       }
  //     }
  //   })
  // }
  
  // // unbloack user
  // async FindAllBlockedUsers(id: number) {
  //   const user = await this.prisma.profile.findUnique({
  //     where: { id: id },
  //     select: {
  //       blocking: true,
  //     },
  //   });
    
  //   if (!user) {
  //     return "No profile with this id";
  //   }
  //   return user;
  // }
  

  // async FindAllFriends(id: number) {
  //   const user = await this.prisma.profile.findUnique({
  //     where: { id: id },
  //     select: {
  //       Friends: true,
  //     },
  //   });

  //   if (!user) {
  //     return "No profile with this id";
  //   }
  //   const friends = await this.prisma.profile.findMany({
  //     where: {
  //       id: {
  //         in: user.Friends,
  //       },
  //     },
  //   });
  //   return friends;
  // }


  async FindUserByID(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        profile: {
          include: {
            sentRequest: true,
            pendingRequest: true,
            blocking: true,
          },
        }
      },
    }); 
    return user;
  }

  async FindUserByIntraId(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {intraid: id},
    });
    return user;
  }

  async RemoveUsers(id: number) {
    this.profile.RemoveProfiles(id);
    const user = await this.prisma.user.delete({
      where: { id: id },
    });
    return user;
  }
}