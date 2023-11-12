import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDmRoomDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatGateway } from './chat.gateway';
import { AuthWithWs } from './dto/user-ws-dto';
import { ConnectedSocket } from '@nestjs/websockets';
import { Client } from 'socket.io/dist/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { use } from 'passport';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from 'src/user/user.service';

@UseGuards(JWTGuard)
@Controller('chatapi')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatgateway: ChatGateway,
    private readonly userService: UserService
  
    ) {}

  @Post()
  async create(@Req() request: Request) {
    const user = await this.userService.getCurrentUser(request);
    console.log("user from rest api chat : ", user.id);
    // console.log("request from rest api chat : ", request);
    // return this.chatService.create(createChatDmRoomDto);
  }

}

