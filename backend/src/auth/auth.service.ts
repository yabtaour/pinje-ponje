import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) {}

    async isTwiFactorCodeValid(user: any, twofactorcode: string){
      return authenticator.verify({
				token: twofactorcode,
				secret: user.twoFactorSecret
			});
    }

    async userTwoFaChecker(user: any, body: { twofactorcode: string }) {
      const validCode = await this.isTwiFactorCodeValid(user, body.twofactorcode);
      if (validCode) {
        return true;
      } else {
        return false;
      }
    }

    async userCreateOrNot(user: any) {
      const checkUser = await this.userService.FindUserByIntraId(user.intraid);
      if (checkUser) {
          console.log("user already exists");
          return checkUser;
    	}
      else {
      	const userCreated = await this.userService.CreateUserIntra(user);
        return userCreated;
      }
    }

		async validateUser(email: string, password: string){
			try {
				const user = await this.userService.FindUserByEmail(email);
				if (!user) {
					throw new NotFoundException("User not found");
				}
				if (bcrypt.compareSync(password, user.Hashpassword)) {
					return user;
				} else {
					throw new NotFoundException("Wrong password");
				}
			} catch (error) {
				throw new NotFoundException(error);
			}
		}

    async signUp(data: SignUpDto) {
      try {
        const user = await this.userService.CreateUserLocal(data);
        return user;
      } catch (error) {
        return "Couldn't Create User"
      }
    }
}
