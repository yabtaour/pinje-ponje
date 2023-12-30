import { Module, forwardRef } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { UserService } from '../user/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { JwtAuthService } from '../auth/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, forwardRef(() => UserModule), NotificationModule],
  providers: [ProfilesService, UserService, JwtAuthService, JwtService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}
