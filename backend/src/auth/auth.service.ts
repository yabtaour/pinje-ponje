import { Injectable } from '@nestjs/common';
import { find } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { Req } from '@nestjs/common';
import { CreateUserDtoLocal } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) {}

    async userCreateOrNot(user: any) {
      const checkUser = await this.userService.FindUserByIntraId(user.intraid);
      if (checkUser) {
          console.log("user already exists");
          return checkUser;
    	}
      else {
      	const userCreated = await this.userService.CreateUser(user);
        return userCreated;
      }
    }

		async validateUser(email: string, Hashpassword: string): Promise<any> {
			const findUser = await this.userService.FindUserByEmail(email);
			if (findUser && findUser.Hashpassword === Hashpassword) {
				return findUser;
			}
			return null;
		}

    async signUp(body: CreateUserDtoLocal) {
      try {
        console.log(body);
        const user = {
				  ...body,
				  profile: {
			      ...body.profile
				  },
				};
        const userCreated = await this.userService.CreateUserLocal(user);
        console.log(user);
        return user;
      } catch (error) {
        throw new Error("Couldn't create user");
      }
    }
}
