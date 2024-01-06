import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/jwt.service';
import { GameModule } from 'src/game/game.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Module({
  controllers: [NotificationController],
  imports: [
    forwardRef(() => GameModule),
    forwardRef(() => PrismaModule),
    forwardRef(() => UserModule),
  ],
  providers: [
    JwtService,
    JwtAuthService,
    NotificationService,
    NotificationGateway,
  ],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
