import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GatewayModule } from './gateway/gateway.module';
import { UserService } from './user/user.service';
import { AuthController, SignUpController } from './auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProfilesModule } from './profiles/profiles.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { JwtAuthService } from './auth/jwt.service';
import { AuthService } from './auth/auth.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './global-exception.filter';
import { Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ProfilesService } from './profiles/profiles.service';
import { PrismaService } from './prisma/prisma.service';
import { RoomsModule } from './chat/rooms/rooms.module';
import { RoomService } from './chat/rooms/rooms.service';
@Module({
  imports: [
    AuthModule, 
    UserModule,
    GatewayModule,
    ProfilesModule,
    PrismaModule,
    ChatModule,
    PassportModule,
		RoomsModule,
    ThrottlerModule.forRoot({
      ttl: 1, // seconds
      limit: 1000, // requests
    }),
  ],
    controllers: [AuthController, SignUpController],
    providers: [
      UserService, JwtAuthService, JwtService,
      ProfilesService, PrismaService, AuthService,
      // {
      //   provide: APP_FILTER,
      //   useClass: GlobalExceptionFilter,
      // },
			RoomService,
      {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter,
      },
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
      },
      JwtAuthService, JwtService,
    ],
})
export class AppModule {}

