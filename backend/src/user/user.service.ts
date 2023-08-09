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
              // intraid: reqData.profile.intraid,
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

  async FindAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    return users;
  }

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
    const profile = await this.prisma.profile.delete({
      where: { id: id },
    });
    const user = await this.prisma.user.delete({
      where: { id: id },
    });
    return user;
  }
}