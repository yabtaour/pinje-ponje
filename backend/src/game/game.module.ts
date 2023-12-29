import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserModule } from '../user/user.module';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [GameController],
  imports: [UserModule, AuthModule, NotificationModule],
  providers: [GameService, GameGateway],
  exports: [GameService, GameGateway],
})
export class GameModule {}
