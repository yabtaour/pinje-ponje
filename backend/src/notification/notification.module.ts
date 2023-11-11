import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [NotificationController],
  imports: [PrismaModule, UserModule],
	providers: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
