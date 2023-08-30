import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { Faker, de, faker, fi } from '@faker-js/faker';

@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService, readonly profile: ProfilesService) {}

async createFakeUsers(number: number) {
  const excludedIds = [1, 2, 7];

  try {
    for (let i = 0; i < number; i++) {
      const fakeUser = {
        firstName: faker.person.firstName(),
        lastName : faker.person.lastName()  + "Fake",
        intraid: faker.number.int(500000) * (i+i),
        Hashpassword: faker.number.int(600) + "password",
      };

      console.log("FakeUser:", fakeUser);

      const createdUser = await this.prisma.user.create({
        data: {
          intraid: fakeUser.intraid,
          Hashpassword: fakeUser.Hashpassword,
          email: fakeUser.lastName + fakeUser.firstName + (i*i) + "@gmail.com",
          profile: {
            create: {
              username: `${fakeUser.firstName}${fakeUser.lastName}`,
              avatar: this.giveRandomAvatar(),
              login: fakeUser.lastName.slice(0, 3) + fakeUser.firstName + faker.number.int(666),
            },
          },
        },
      });
      console.log("Created User:", createdUser);
    }
    return "Fake Users Creation Success";
  } catch (error) {
    console.error(error);
    return "Error: User Already Exists";
  }
}

<<<<<<< HEAD

  async CreateUser(newUser: CreateUserDto) {
=======
  async CreateUser(reqData: any) {
    // try {
			console.log(reqData);
>>>>>>> dev
      const user = await this.prisma.user.create({
        data: {
          intraid: reqData.intraid,
          Hashpassword: reqData.Hashpassword,
          email: reqData.email,
          profile: {
            create: {
              username: reqData.profile.username,
              avatar: reqData.profile.avatar,
              login: reqData.profile.login,
            },
          }
        }
      })
      if (!user) throw new HttpException("User Creation Failed", 500);
      return user;
<<<<<<< HEAD
=======
    // } catch (error) {
		// 	console.log("User already exist");
    //   // console.log(error);
    //   // return "Error: User Already Exist";
    // }
>>>>>>> dev
  }

  giveRandomAvatar() {
    const avatar = [
      "path://shinra.png",
      "path://stewie.png",
      "path://escanor.png",
    ];
    return avatar[Math.floor(Math.random() * avatar.length)];
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
    const user = await this.prisma.user.delete({
      where: { id: id },
    });
    return user;
  }
}