import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

// let Guser = {
//   id: 3,
//   intraid: 3,
//   Hashpassword: "1233",
//   email : "rrre@rr",
// };

// let Gprofile = {
//   id: 3,
//   username: "r8",
//   login: "r8",
// };


    // need Protection for this route
    // need to check if the user is already exist
    // need to check if the profile is already exist
    // need to check if the email is already exist
    // friendshipes need to be protected from blocked and pending users
@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService) {}



  async CraeteUser(reqData: any) {
    const userFind = await this.prisma.user.findUnique({
      where: { id: reqData.id },
    });
    if (userFind) {
      return "User already exist";
    }
    const user = await this.prisma.user.create({
      data: {
          id : reqData.id,
          intraid: reqData.intraid,
          Hashpassword: reqData.Hashpassword,
          email: reqData.email,
          profile: {
            create: {
              id: reqData.profile.id,
              username: reqData.profile.username,
              avatar: reqData.profile.avatar,
              login: reqData.profile.login,
            },
        }
      }
   })
    return user;
  }

  async FindAllProfiles() {
    const user = await this.prisma.profile.findMany({
      include: {
        pendingRequest: true,
        sentRequest: true,
      },
    });
    return user;
  }
  async FindAllUsers() {
    const user = await this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    return user;
  }

  async AccepteFriendRequest(data: any) {
    const user = await this.prisma.profile.findUnique({
      where: { id: data.id },
      include: { pendingRequest: true },
    });
    if (user){
      const existingRequest = user.pendingRequest.find((element) => element.id === data.senderID);
      if (!existingRequest) {
        return "No request with this id";
      }
      const updateSender = await this.prisma.profile.update({
        where: { id: data.id },
        data: {
          pendingRequest: {
            disconnect: { id: data.senderID }
          },
          Friends: {
            push : data.senderID
          }
        },
      });
      const senderProfile = await this.prisma.profile.findUnique({
        where: { id: data.senderID },
      });
      if (senderProfile) {
        const updatesenderProfile = await this.prisma.profile.update({
          where: { id: data.senderID },
          data: {
            sentRequest: {
              disconnect: { id: data.id }
            },
            Friends: {
              push : data.id
            }
          },
        });
      }
    }
  }

  async SentFriendsInvitation(data: any) {
    
    const newFriendProfile = await this.prisma.profile.findUnique({
      where: { id: data.newFriendID },
    });
    
    if (!newFriendProfile) {
      return "No profile with this id";
    }
    const sender = await this.prisma.profile.update({
      where: { id: data.senderID },
      data: {
        sentRequest: {
          connect: { id: data.newFriendID }
        }
      },
    });
    return sender;
  }


  async FindAllFriends(id: number) {
    const user = await this.prisma.profile.findUnique({
      where: { id: id },
      select: {
        Friends: true,
      },
    });

    if (!user) {
      return "No profile with this id";
    }
    const friends = await this.prisma.profile.findMany({
      where: {
        id: {
          in: user.Friends,
        },
      },
    });
    return friends;
  }


  async FindUserByID(id: number) {
    const user = await this.prisma.profile.findUnique({
      where: { id: id },
    }); 
    return user;
  }

  async RemoveUsers(id: number) {
    this.RemoveProfiles(id);
    const user = await this.prisma.user.delete({
      where: { id: id },
    });
    return user;
  }

  async RemoveProfiles(id: number) {
    const user = await this.prisma.profile.delete({
      where: { id: id },
    });
    return user;
  }
}