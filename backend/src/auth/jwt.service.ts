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
      return this.jwtService.verify(token, {
        secret: 'secretString'});
  } catch (err) {
   throw new UnauthorizedException();

    // console.log("Error decoding the Token");
  }
}
}