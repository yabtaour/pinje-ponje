import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { profile } from 'console';

let Guser = {
  id: 2,
  intraid: 2,
  Hashpassword: "123",
  email : "rr@rr",
};

let Gprofile = {
  id: 1,
  username: "r",
  login: "r",
};

@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService) {}
  // prsima = new PrismaService();
  async CraeteUser(dataa: any) {
    const user = await this.prisma.user.create({
      data: {
          id : Guser.id,
          intraid: Guser.intraid,
          Hashpassword: Guser.Hashpassword,
          email: Guser.email,
          profile: {
            create: {
              id: Guser.id,
              username: Gprofile.username,
              login: Gprofile.login,
            },
        }
      }
   })
    return dataa;
  }

  async FindAllProfiles() {
    const user = await this.prisma.profile.findMany();
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

  // async AccepteFriendRequest(id: number) {
  //   const user = await this.prisma.profile.update({
  //     where: { id: id },
  //     data: { friendRequest: true },
  //   });
  //   return user;
  // }

  FindUserByID(id: number) {
    const user = this.prisma.profile.findUnique({
      where: { id: id },
    }); 
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  RemoveUsers(id: number) {
    const profile = this.prisma.profile.delete({
      where: { id: id },
    });
    const user = this.prisma.user.delete({
      where: { id: id },
    });
    return user;
  }
}
