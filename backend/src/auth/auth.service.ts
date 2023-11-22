import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signUp.dto';
import { JwtAuthService } from './jwt.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
				private readonly jwtService: JwtAuthService
    ) {}

    async isTwiFactorCodeValid(user: any, twofactorcode: string){
      console.log(twofactorcode);
      console.log(user.twoFactorSecret);
      const result = await authenticator.verify({
        token: String(twofactorcode),
        secret: user.twoFactorSecret
      });
      console.log(result);
      return result;
      // return authenticator.verify({
			// 	token: String(twofactorcode),
			// 	secret: user.twoFactorSecret
			// });
    }

    async userTwoFaChecker(user: any, body: { twofactorcode: string }) {
      console.log(body);
      const validCode = await this.isTwiFactorCodeValid(user, String(body.twofactorcode));
      console.log(validCode);
      if (validCode) {
        return true;
      } else {
        return false;
      }
    }

    async userCreateOrNot(user: any, type: string) {
      let checkUser = null;
      if (type === "google") {
        checkUser = await this.userService.FindUserByGoogleId(user.googleId);
        if (checkUser) {
          return checkUser;
    	  } else {
          const userCreated = await this.userService.CreateUserGoogle(user);
          return userCreated;
        }
      } else if (type === "42") {
        checkUser = await this.userService.FindUserByIntraId(user.intraid);
        if (checkUser) {
            return checkUser;
        } else {
          const userCreated = await this.userService.CreateUserIntra(user);
          return userCreated;
      }
    }
  }

		async validateUser(email: string, password: string){
				const user = await this.userService.FindUserByEmail(email);
				if (!user) 
					throw new HttpException("User not found", HttpStatus.NOT_FOUND);
				if (bcrypt.compareSync(password, user.password)) {
					return user;
				} else {
					throw new HttpException("Wrong password", HttpStatus.BAD_REQUEST);
				}
		}

    async signUp(data: SignUpDto) {
      const user = await this.userService.CreateUserLocal(data);
			const token = await this.jwtService.generateToken(String(user.id));
      return { user, token };
    }
}
