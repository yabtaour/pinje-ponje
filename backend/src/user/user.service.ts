import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
    
  async CreateUsersFake() {
    try {
      // console.log("CreateUsersFake");
      for (let i = 0; i < 2; i++) {

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

  async CreateUser(reqData: CreateUserDto) {
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
      if (!user)
      throw new HttpException('User creation failed: Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
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
    select: {
      id: true,
      email: true,
      twofactor: true,
      profile: {
        select: {
          id : true,
          username: true,
          avatar: true,
          login: true,
          Rank: true,
          level: true,
          sentRequest: true,
          pendingRequest: true,
          blocking: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new HttpException("User not found", HttpStatus.NOT_FOUND);
  }

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
      where: { userid: id },
    });
    const user = await this.prisma.user.delete({
      where: { id: id },
    });
    if (!user)
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    return user;
  }
}