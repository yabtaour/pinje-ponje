import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';

config()

const secret = process.env.JWT_SECRET;

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(id: string){
    const payload = { sub: id };
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string, context: ExecutionContext) {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      if (!decodedToken || !decodedToken.sub)
				return null;
			return decodedToken;
  }
}