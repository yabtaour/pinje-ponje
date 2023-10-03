import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
// import { MuteCheckMiddleware } from './middlewares/MuteCheckMiddleware';

@Module({
  controllers: [],
  imports: [PrismaModule],
  providers: [ ChatGateway, ChatService, PrismaService],
  exports: [ChatGateway],
})
export class ChatModule {}
