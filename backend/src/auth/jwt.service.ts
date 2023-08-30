import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExecException } from 'child_process';
import { config } from 'dotenv';

config()

const secret = process.env.JWT_SECRET;

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(id: string): Promise<string> {
    const payload = { sub: id };
    console.log(payload);
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string, context: ExecutionContext): Promise<any> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      return decodedToken;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
				console.log('Token has been expired');
			} else {
				console.error('Token verification failed:', err.message);
			}
      const response = context.switchToHttp().getResponse();
      response.redirect("http://localhost:3000/auth/42");
			// return null;
    }
  }
}