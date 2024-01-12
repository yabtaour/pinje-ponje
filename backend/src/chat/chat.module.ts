import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/jwt.service';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';
// import { MuteCheckMiddleware } from './middlewares/MuteCheckMiddleware';

@Module({
  controllers: [ChatController],
  imports: [PrismaModule, AuthModule, UserModule, NotificationModule],
  providers: [ ChatGateway, ChatService, PrismaService],
  exports: [ChatGateway],
})
export class ChatModule {}
