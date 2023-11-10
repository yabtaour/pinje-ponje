import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { FortyTwoStrategy } from './42.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthService } from './jwt.service';
import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';

config()

const secret = process.env.JWT_SECRET;

@Module({
  imports: [
		UserModule,
		PassportModule,
    JwtModule.register({
      secret: secret,
      signOptions: {expiresIn: '30d'},
    }),
  ],
  controllers: [AuthController],
  exports: [JwtAuthService, AuthService, PrismaService],
  providers: [JwtAuthService, AuthService, PrismaService,
							FortyTwoStrategy, LocalStrategy, GoogleStrategy, UserService,
							ProfilesService],
  exports: [JwtAuthService, AuthService, PrismaService],
  
})
export class AuthModule {}

