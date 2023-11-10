import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtAuthService } from './auth/jwt.service';
import { ChatModule } from './chat/chat.module';
import { GameController } from './game/game.controller';
import { GameGateway } from './game/game.gateway';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';
import { GlobalExceptionFilter } from './global-exception.filter';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfilesModule } from './profiles/profiles.module';
import { ProfilesService } from './profiles/profiles.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    ProfilesModule,
    PrismaModule,
    PassportModule,
		GameModule,
    // ThrottlerModule.forRoot({
    //   ttl: 1, // seconds
    //   limit: 1000, // requests
    // }),
    ChatModule,
  ],
    controllers: [AuthController, GameController],
    providers: [
      UserService, JwtAuthService, JwtService,
      ProfilesService, PrismaService, AuthService,
			GameService, GameGateway,
      {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter,
      },
    ],
})
export class AppModule {}

