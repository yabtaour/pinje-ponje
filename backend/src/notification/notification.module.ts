import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [NotificationController],
  imports: [forwardRef(() => PrismaModule), forwardRef(() => UserModule)],
	providers: [NotificationService, NotificationGateway],
	exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
