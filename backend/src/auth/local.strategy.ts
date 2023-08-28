
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt.service';
import { UserService } from 'src/user/user.service';
// import { getMaxListeners } from 'process';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
		private readonly jwtService: JwtAuthService,
		private readonly userService: UserService,
		private readonly authService: AuthService,
	){
    super({
			usernameField: 'email',
		});
  }

  async validate(email: string, Hashpassword: string): Promise<any> {
		console.log("trying to validate user");
    const user = await this.authService.validateUser(email, Hashpassword);
		if (!user) {
     	  console.log("no user");
				throw	new UnauthorizedException;
    }
    const token = await this.jwtService.generateToken(String(user.id));
		console.log("user found");
		return {user, token};
  }
}

