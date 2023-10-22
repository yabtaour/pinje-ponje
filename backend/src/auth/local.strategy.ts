
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(
		private readonly jwtService: JwtAuthService,
		private readonly authService: AuthService
	) {
    	super({
        usernameField: 'email',
        passwordField: 'password',
      });
  	}

  async validate(email: string, password: string, done: (error: any, user?: any) => void) {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND);
      }
      const token = await this.jwtService.generateToken(String(user.id));
      done(null, { user, token });
  }
}