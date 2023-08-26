import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
// import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { GatewayModule } from './gateway/gateway.module';
import { AuthController } from './auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProfilesModule } from './profiles/profiles.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { JwtAuthService } from './auth/jwt.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './global-exception.filter';
import { Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    GatewayModule,
    ProfilesModule,
    PrismaModule,
    ChatModule,
    ThrottlerModule.forRoot({
      ttl: 1, // seconds
      limit: 100, // requests
    }),
    // PassportModule
  ],
    controllers: [AuthController],
    providers: [
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

