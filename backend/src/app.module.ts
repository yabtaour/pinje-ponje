import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
// import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { GatewayModule } from './gateway/gateway.module';
import { UserService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { ProfilesModule } from './profiles/profiles.module';
import { ProfilesService } from './profiles/profiles.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { JwtAuthService } from './auth/jwt.service';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    GatewayModule,
    ProfilesModule,
    PrismaModule,
    ChatModule,
    // PassportModule
  ],
    controllers: [AuthController],
    providers: [
      UserService, JwtAuthService, JwtService,
      ProfilesService, PrismaService],
})
export class AppModule {}
