import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(intraId: string): Promise<string> {
    const payload = { sub: intraId };
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: 'secret-string',
      });
      return decodedToken;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
				console.log('Token has been expired');
			} else {
				console.error('Token verification failed:', err.message);
			}
			return null;
    }
  }
}