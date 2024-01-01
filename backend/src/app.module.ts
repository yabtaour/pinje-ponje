import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { GlobalExceptionFilter } from './global-exception.filter';
import { NotificationModule } from './notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({}),
    AuthModule, 
    UserModule,
    ProfilesModule,
    PrismaModule,
    PassportModule,
		GameModule,
		ChatModule,
		NotificationModule,
    // ThrottlerModule.forRoot({
    //   ttl: 1, // seconds
    //   limit: 1000, // requests
    // }),
  ],
    controllers: [AuthController, GameController],
    providers: [
      {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter,
      },
    ],
})
export class AppModule {}

