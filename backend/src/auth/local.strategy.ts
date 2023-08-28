
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt.service';
import { UserService } from 'src/user/user.service';
import { getMaxListeners } from 'process';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
		private readonly jwtService: JwtAuthService,
		private readonly userService: UserService,
		private readonly authService: AuthService,
	){
    super();
  }

  async validate(email: string, password: string, done:(error: any, user?: any) => void): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    const token = await this.jwtService.generateToken(String(user.id));
		if (!user) {
        console.log("no user");
        throw new UnauthorizedException();
    }
		console.log("user found");
		return user;
  }
}

