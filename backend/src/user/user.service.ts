import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Faker, de, faker } from '@faker-js/faker';

    // need Protection for this route
    // need to check if the user is already exist
    // need to check if the profile is already exist
    // need to check if the email is already exist
    // friendshipes need to be protected from blocked and pending users

class data {
  intraid: number;
  Hashpassword: string;
  email: string;
  profile: {
    username: string;
    avatar: string;
    login: string;
  }
}
    // to do:
    // ulpoading avatar's
    // guards and middlewares
@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService, readonly profile: ProfilesService) {}
    
  async CreateUsersFake(number: number) {
    // const user = await this.prisma.profile.deleteMany({
    //   where: {
    //     NOT: {
    //       OR: [
    //         { id: 1 },
    //         { id: 2 },
    //         { id: 7 }
    //       ]
    //     }
    //   }
    // });
    // console.log("user: ", user);
    // await this.prisma.user.deleteMany({
    //   where: {
    //     NOT: {
    //       OR: [
    //         { id: 1 },
    //         { id: 2 },
    //         { id: 7 }
    //       ]
    //     }
    //   }
    // });
    try {
      // console.log("CreateUsersFake");
      for (let i = 0; i < 1000; i++) {

        // init fake data
        const FakeUser =  new data();
        let firstName = faker.person.firstName();
        let lastName = faker.person.lastName();
        FakeUser.intraid = faker.number.int(500000);
        FakeUser.Hashpassword = faker.number.int(600) + "password";
        FakeUser.email = firstName + lastName + (i*i) + "@gmail.com";

        console.log("FakeUser: ", FakeUser);
        console.log("FirstName: ", firstName);
        console.log("LastName: ", lastName);

        await this.prisma.user.create({
          data: {
            intraid: FakeUser.intraid,
            Hashpassword: FakeUser.Hashpassword,
            email: FakeUser.email,
            profile: {
              create: {
                username: firstName + lastName,
                avatar: "./path/to/avatar/" + lastName + faker.number.int(9000),
                login: firstName + faker.number.int(11),
              },
            }
          }
        })
      }
      return "Fake Users Creatig Success";
    } catch (error) {
      console.log(error);
      return "Error: User Already Exist";
    }
  }

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

	async FindUserByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email: email },
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