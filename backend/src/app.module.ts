import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtAuthService } from './auth/jwt.service';
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
    // ThrottlerModule.forRoot({
    //   ttl: 1, // seconds
    //   limit: 1000, // requests
    // }),
    // ChatModule,
  ],
    controllers: [AuthController],
    providers: [
      UserService, JwtAuthService, JwtService,
      ProfilesService, PrismaService, AuthService,
      // {
      //   provide: APP_FILTER,
      //   useClass: GlobalExceptionFilter,
      // },
      // {
      //   provide: APP_FILTER,
      //   useClass: GlobalExceptionFilter,
      // },
      // {
      //   provide: APP_GUARD,
      //   useClass: ThrottlerGuard,
      // },
    ],
})
export class AppModule {}

