import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { JwtAuthService } from '../auth/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, ProfilesModule, NotificationModule],
  providers: [UserService, JwtService, JwtAuthService, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
