import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateUserDtoIntra } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

config()

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

@Injectable()
export class UserService {
  constructor(
		private readonly prisma: PrismaService,
		private readonly profile: ProfilesService
	) {}
    
  async CreateUsersFake() {
    try {
      for (let i = 0; i < 2; i++) {
        const FakeUser =  new data();
        let firstName = faker.person.firstName();
        let lastName = faker.person.lastName();
        FakeUser.intraid = faker.number.int(500000);
        FakeUser.Hashpassword = faker.number.int(600) + "password";
        FakeUser.email = firstName + lastName + (i*i) + "@gmail.com";
        await this.prisma.user.create({
          data: {
            intraid: FakeUser.intraid,
            password: FakeUser.Hashpassword,
            email: FakeUser.email,
            profile: {
              create: {
                username: firstName + lastName,
                avatar: "./path/to/avatar/" + lastName + faker.number.int(9000),
              },
            }
          }
        })
      }
      return "Fake Users Creatig Success";
    } catch (error) {
      return "Error: User Already Exist";
    }
  }

  async resetPassword(user: any, old: string, newPass: string) {
	const isMatch = await bcrypt.compareSync(old, user.password);
	if (!isMatch)
		throw new HttpException('Old password is incorrect', HttpStatus.BAD_REQUEST);
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
		// try {
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
          }
        }
      })
      if (!user)
        throw new HttpException('User creation failed: Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
      return user;
		// } catch (error) {
		// 	throw new InternalServerErrorException(error);
		// }
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
		}
	  }
	})
	if (!user)
	  throw new HttpException('User creation failed: Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
	return user;
  }

  async CreateUserLocal(data: any) {
    // try {
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
              avatar: "data.profile.avatar",
            },
          }
        }
      })
      if (!user) {
        throw new HttpException('User creation failed: Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      return user;
    // } catch (error) {
    //   throw new HttpException('User creation failed: Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
    // }
}

// this only update User Level : Email : Hashpassword : twofactor
  async UpdateUser(id: number, data: updateUserDto) {
		// try {
			const user = await this.prisma.user.findUnique({
				where : {
					id: id,
				},
			});
			if (!user)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
			if (data.password) {
				const rounds = await parseInt(process.env.BCRYPT_ROUNDS);
				const HashedPassword = await bcrypt.hashSync(data.password, rounds);
				data.password = HashedPassword;
			}
    	const updatedUser = await this.prisma.user.update({
      	where: {
					id: id,
				},
      	data: {
        	...data,
        	profile: {
          	update: {
           		...data.profile,
          	},
        	},
      	}
    	})
    	return updatedUser;
		// } catch (error) {
		// 	throw new InternalServerErrorException(error);
		// }
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
		// try {
    	const users = await this.prisma.user.findMany({
      	include: {
       		profile: true,
      	},
    	});
			if (!users)
				throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    	return users;
		// } catch (error) {
		// 	throw new InternalServerErrorException(error);
		// }
  }

async FindUserByID(id: number) {
	// try {
  	const user = await this.prisma.user.findUnique({
    	where: { id: id },
    	// select: {
      // 	id: true,
      // 	email: true,
      // 	twofactor: true,
      // 	twoFactorSecret: true,
      // 	profile: {
      // 	  select: {
      // 	    id : true,
      // 	    username: true,
      // 	    avatar: true,
      // 	    login: true,
      // 	    Rank: true,
      // 	    level: true,
      // 	    sentRequest: true,
      // 	    pendingRequest: true,
      // 	    blocking: true,
      // 	    createdAt: true,
      // 	  },
      // 	},
    	// },
  	});
  	if (!user) {
    	throw new HttpException("User not found", HttpStatus.NOT_FOUND);
  	}
  	return user;
	// } catch (error) {
	// 	throw new InternalServerErrorException(error);
	// }
}

  async FindUserByIntraId(id: number) {
		// try {
    	const user = await this.prisma.user.findFirst({
      	where: {intraid: id},
    });
    return user;
		// } catch (error) {
		// 	throw new InternalServerErrorException(error);
		// }
	}

	async FindUserByGoogleId(id: string) {
		const user = await this.prisma.user.findFirst({
			where: {googleId: id},
		});
		return user;
	}

	async FindUserByEmail(email: string) {
		// try {
			const user = await this.prisma.user.findUnique({
				where: {
					email: email,
				}
			});
			if (!user)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
    	if (!user)
      	throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    	return user;
		// } catch (error) {
		// 	throw new InternalServerErrorException(error);
		// }
	}

	async getQRCode(id: number) {
		// try {
			console.log("id from user service : ", id);
			const user = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
			});
			if (!user)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
			console.log("user from user service : ", user);
			if (user.twoFactor == false)
			{
				console.log("Two factor is not enabled");
				throw new HttpException('Two factor is not enabled', HttpStatus.NOT_FOUND);
			}
			console.log("Two factor is enabled");
			const secret = user.twoFactorSecret;
			const otpauth = authenticator.keyuri(user.email, "pinje-ponge", secret);
			const generatedQR = await toDataURL(otpauth);
			return generatedQR;
		// } catch (error) {
		// 	throw new InternalServerErrorException(error);
		// }
	}

	async getCurrentUser(request: any) {
		// try {
			// console.log("request from user service : ", request);
			// console.log("request.user from user service : ", request.user);
			// console.log("request.user.sub from user service : ", request.user.sub);
			const user = await this.prisma.user.findUnique({
				where: {
					id: parseInt(request.user.sub),
				},
				include: {
					profile: true,
				},
			});
			if (!user)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
			return user;
		// } catch (error) {
		// 	throw new InternalServerErrorException(error);
		// }
	}

}



