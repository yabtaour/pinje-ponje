import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe } from '@nestjs/common';
import { ChatService, PaginationLimitDto, joinRoomDto } from './chat.service';
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
import { th } from '@faker-js/faker';

@UseGuards(JWTGuard)
@Controller('chatapi')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatgateway: ChatGateway,
    private readonly userService: UserService
  
    ) {}

  @Post('createRoom')
  async createRoom(
      @Req() request: Request,
      @Body() data: CreateChatDmRoomDto
    ){
    const user = await this.userService.getCurrentUser(request);
    const room = await this.chatService.createRoom(user.id, data);
    this.chatgateway.server.to(String(user.id)).emit('roomCreated', room);
    return room;
  }

  @Get('getRooms')
  async getAllRooms(
      @Req() request: Request,
      @Query() query: PaginationLimitDto
    ){

    const user = await this.userService.getCurrentUser(request);
    const rooms = await this.chatService.getRoomsByUserId(user.id, query);
    this.chatgateway.server.to(String(user.id)).emit('listOfRooms', rooms);
    return rooms;
  }

  @Get('getRoom/:name')
  async getOneRoom(
      @Req() request: Request,
      @Param('name') name: string
    ){

    const user = await this.userService.getCurrentUser(request);
    const room = await this.chatService.getRoomByNames(name);
    this.chatgateway.server.to(String(user.id)).emit('roomDetails', room);
    return room;
  }

  @Post('joinRoom/:id')
  async joinRoom(
      @Param('id' , ParseIntPipe) room_id: number,
      @Req() request: Request,
      @Body() payload: joinRoomDto
  ){
    const user = await this.userService.getCurrentUser(request);
    const room = await this.chatService.joinRoom(user.id, payload , room_id);
    this.chatgateway.server.to(String(user.id)).emit('joinedRoom', room);
    return room;
  }

  @Get('getRoomUsers/:id')
  async getRoomUsers(
      @Param('id' , ParseIntPipe) room_id: number,
      @Req() request: Request,
      @Query() query: PaginationLimitDto
  ){
    const user = await this.userService.getCurrentUser(request);
    const roomUers = await this.chatService.getRoomUsers(user.id, room_id, query);
    this.chatgateway.server.to(String(user.id)).emit('listOfRoomMembers', roomUers);
    return roomUers;
  }

  @Get('getRoomMessages/:id')
  async getRoomMessages(
      @Param('id' , ParseIntPipe) room_id: number,
      @Req() request: Request,
      @Query() query: PaginationLimitDto
  ){
    const user = await this.userService.getCurrentUser(request);
    const roomMessages = await this.chatService.getMessages(user.id, room_id, query);
    this.chatgateway.server.to(String(user.id)).emit('listOfMessages', roomMessages);
    return roomMessages;
  }

  @Post('sendMessage/:id')
  async sendMessage(
      @Param('id' , ParseIntPipe) room_id: number,
      @Req() request: Request,
      @Body() payload: any
  ){
    const user = await this.userService.getCurrentUser(request);
    const message = await this.chatService.createMessage(user.id, room_id, payload);
    this.chatgateway.server.to(String(user.id)).emit('message', message);
    return message;
  }

}


