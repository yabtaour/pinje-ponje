import { Module } from '@nestjs/common';
<<<<<<< HEAD

@Module({})
=======
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService]
})
>>>>>>> dev
export class ChatModule {}
