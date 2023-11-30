import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { JwtAuthService } from '../auth/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [PrismaModule, ProfilesModule, NotificationModule],
  providers: [UserService, JwtService, JwtAuthService, UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
