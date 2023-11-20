import { de, faker, th, tr } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateUserDtoIntra } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { SignUpDto } from 'src/auth/dto/signUp.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaginationLimitDto } from 'src/chat/chat.service';

config()

export class blockAndUnblockUserDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;
}

export class FriendsActionsDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;
}

@Injectable()
export class UserService {
  constructor(
		private readonly prisma: PrismaService,
		private readonly profile: ProfilesService
	) {}

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

  async CreateUserLocal(data: SignUpDto) {
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
          password: HashedPassword,
          email: data.email,
          profile: { 
            create: {
              username: data.username,
            },
          }
        }
      })
      if (!user) {
        throw new HttpException('User creation failed: Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      return user;
}

// this only update User Level : Email : Hashpassword : twofactor
  async UpdateUser(id: number, data: updateUserDto) {
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
  }


  giveRandomAvatar() {
    const avatar = [
      "path://shinra.png",
      "path://stewie.png",
      "path://escanor.png",
    ];
    return avatar[Math.floor(Math.random() * avatar.length)];
  }

  async FindAllUsers(_id: number) {
    const users = await this.prisma.user.findMany({
		select: {
			id: true,
			email: true,
			status: true,
			twoFactor: true,
			profile: true,
		},
    });
	if (!users)
		throw new HttpException('Users not found', HttpStatus.NOT_FOUND);	
    return users;
  }

async FindUserByID(id: number) {
  	const user = await this.prisma.user.findUnique({
    	where: { id: id },
		include: {
			profile: true,
		},
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
	delete user.password;
	delete user.twoFactorSecret;
	
  	return user;
}

  async FindUserByIntraId(id: number) {
    	const user = await this.prisma.user.findFirst({
    	  	where: {intraid: id},
    	});
    	return user;
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
	}

	async getCurrentUser(request: any) {
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
			delete user.password;
			delete user.twoFactorSecret;
			return user;
	}

	async FindAllBlockedUsers(_id: number) {
		const user = await this.prisma.user.findUnique({
		  where: { id: _id },
		  select: {
			blocking: true,
		  },
		});
		if (!user)
		  throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		return user;
	  }

	async BlockFriend(_id: number, data: blockAndUnblockUserDto){
		const blockedUser = await this.prisma.user.findUnique({
			where : { id: data.id},
		});
		if (!blockedUser)
		  throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		if (blockedUser.id == _id)
		  throw new HttpException("You can't block yourself", HttpStatus.BAD_REQUEST);
		const user = await this.prisma.user.update({
		  where: { id: _id},
		  data: {
			blocking: {
			  connect: { id: data.id }
			}
		  }
		})
		return user;
	}

	async UnBlockFriend(_id: number, data: blockAndUnblockUserDto){

		const blockedUser = await this.prisma.user.findUnique({
		  where : { id: data.id}
		})
		if (!blockedUser)
		  throw new HttpException("User not found", HttpStatus.NOT_FOUND);
		const user = await this.prisma.user.update({
		  where: { id: _id},
		  data: {
			blocking: {
			  disconnect: { id: data.id }
			}
		  }
		})
		return user;
	}

	async FindAllFriends(_currentUser: number, _id: number, params: PaginationLimitDto) {
		const isBlocked = await this.isBlockby(_currentUser, _id);
		const isBlockedby = await this.isBlockby(_id, _currentUser);
		if (isBlocked || isBlockedby)
		  return [];
		const getAllFriends = await this.prisma.user.findUnique({
		  where: { id: _id },
			  select: {
				Friends: true,
			  },
		});
		const infoAboutAllFriends = await this.prisma.user.findMany({
		  where: {
			id: {
			  in: getAllFriends.Friends,
			},
		  },
		  select: {
			id: true,
			profile : true,
		  },
		  ...params,
		});
		if (!getAllFriends || !infoAboutAllFriends)
		  throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);
		const filterdFriends =  await this.filterFriendsByBlockingStatus(infoAboutAllFriends, _currentUser);
		return filterdFriends;
	  }

	  async Unfriend(profileId: number, data: any): Promise<any> {

		const friendProfile = await this.prisma.user.findUnique({
		  where: { id: data.id },
		});
	
		if (!friendProfile)
			throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);
	
		await this.removeFromFriendList(profileId, data.id);
		await this.removeFromFriendList(data.id, profileId);
	
		return friendProfile;
	  }


	  async CancelFriendRequest(_id: number, data: FriendsActionsDto) {

		const receiver = await this.prisma.user.findUnique({
		  where: { id: data.id },
		  include: { pendingRequest: true },
		});
		if (!receiver)
			throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);
		
		const existingRequest = receiver.pendingRequest.find((element) => element.id === _id);
		if (!existingRequest)
			throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);
		const req_receiver = await this.prisma.user.update({
		  where: { id: _id },
		  data: {
			sentRequest: {
			  disconnect: { id: data.id }
			}
		  },
		});

		return req_receiver;
	  }


	  async DeclineFriendRequest(_id: number, data: FriendsActionsDto) {
		const inviter = await this.prisma.user.findUnique({
		  where: { id: data.id },
		  include: { sentRequest: true },
		});
		if (!inviter)
			throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);
	
		const existingRequest = inviter.sentRequest.find((element) => element.id === _id);
		if (!existingRequest)
			throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);
		const req_sender = await this.prisma.user.update({
		  where: { id: _id },
		  data: {
			pendingRequest: {
			  disconnect: { id: data.id } 
			}
		  },
		});
		return req_sender;
	  }


	  async AcceptFriendRequest(_id: number, data: FriendsActionsDto) {

		const peer_user = await this.prisma.user.findUnique({
		  where: { id: data.id },
		  include: { sentRequest: true },
		});
		if (peer_user){
		  const existingRequest = peer_user.sentRequest.find((element) => element.id === _id);
		  if (!existingRequest)
			throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);
	
		  const otheruser = await this.prisma.user.update({
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
		  const buttonclicker = await this.prisma.user.findUnique({
			where: { id: _id },
		  });
		  if (buttonclicker) {
			const updateclickerProfile = await this.prisma.user.update({
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

	  async SentFriendRequest(_id: number, data: FriendsActionsDto) {
		
		const newFriendProfile = await this.prisma.user.findUnique({
		  where: { id: data.id },
		});
		
		if (!newFriendProfile)
		  throw new HttpException('No profile with this id', HttpStatus.NOT_FOUND);
		const sender = await this.prisma.user.update({
		  where: { id: _id },
		  data: {
			sentRequest: {
			  connect: { id: data.id }
			}
		  },
		});
		return sender;
	  }

	  // Not routes functions
	  async isBlockby(_id: number, id: number) : Promise<boolean>{
		const user = await this.prisma.user.findUnique({
		  where: { id: _id },
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

	  async removeFromFriendList(profileId: number, friendId: number): Promise<void> {

		const user = await this.prisma.user.findUnique({
		  where: { id: profileId },
		});
	
		if (user) {
		  const updatedFriends = user.Friends.filter((friend) => friend !== friendId);
	
		  await this.prisma.user.update({
			where: { id: profileId },
			data: {
			  Friends: {
				set: updatedFriends,
			  },
			},
		  });
		}
	  }
} 

