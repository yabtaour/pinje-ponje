import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './42.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: '42'}),
    UserModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '60s'},
    }),
  ],
  controllers: [AuthController],
  providers: [JwtAuthService ,PrismaService ,FortyTwoStrategy, UserService, AuthService],
})
export class AuthModule {}
