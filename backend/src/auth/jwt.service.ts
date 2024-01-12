import { ExecutionContext, Injectable, ParseIntPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { PrismaService } from '../prisma/prisma.service';

config()

const secret = process.env.JWT_SECRET;

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async generateToken(id: string){
    const payload = { sub: id };
		const token = await this.jwtService.signAsync(payload, {secret});
  	return token;
  }

  async verifyToken(token: string, context: ExecutionContext) {
      const actualToken = token.split(' ')[1];
      const decodedToken = await this.jwtService.verify(actualToken, {
        secret: secret,
      });
      if (!decodedToken || !decodedToken.sub)
				return null;
      if (decodedToken.sub >= 2147483647)
        return null;
      const user = await this.prismaService.user.findUnique({
        where: { id: Number(decodedToken.sub) },
      });
      if (!user)
				 return null;
			return decodedToken;
  }
}