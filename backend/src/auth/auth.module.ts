import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './42.strategy';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { config } from 'dotenv';
// import { profile } from 'console';
import { ProfilesService } from 'src/profiles/profiles.service';
import { SignUpController } from './auth.controller';

config()

const secret = process.env.JWT_SECRET;

@Module({
  imports: [
		UserModule,
		PassportModule,
    // JwtModule.register({ defaultStrategy: '42'}),
    JwtModule.register({
      secret: secret,
      signOptions: {expiresIn: '30d'},
    }),
  ],
  controllers: [AuthController, SignUpController],
  providers: [JwtAuthService, AuthService, PrismaService,
							FortyTwoStrategy, LocalStrategy, UserService,
							ProfilesService],
})
export class AuthModule {}
