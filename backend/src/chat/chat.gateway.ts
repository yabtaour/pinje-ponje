import {
  WebSocketGateway, WebSocketServer, 
  SubscribeMessage, MessageBody, 
  OnGatewayInit, WsResponse,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io'
import { Logger, UseFilters, UsePipes, ValidationPipe, WsExceptionFilter } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDmRoomDto } from './dto/create-chat.dto';
import { ChatRoom } from '@prisma/client';
import { AllExceptionsFilter } from '../all.exception.filter';
import { AuthWithWs, UserWsDto } from './dto/user-ws-dto';


@UsePipes(new ValidationPipe())
@UseFilters(new AllExceptionsFilter())
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
    // transformOption : {
    //   transform: false,
    // },
    // methods: ['GET', 'POST'],
  }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Namespace;
  constructor(private readonly chatService: ChatService) {}
  logger: Logger = new Logger('Chat Gateway');
  
  afterInit(server: Server) {
    this.logger.log('Chat Gateway Initialized');
  }

  async handleConnection(client: AuthWithWs) {
    const sockets = this.server.sockets;

    const userRooms = await this.chatService.getRoomsByUserId(+client.id, {skip: 0});
  
    userRooms.forEach((room) => {
      this.logger.debug(`Client ${client.id} joined room ${room.name}`);
      client.join(room.name);
    });
  
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.log(`Client connected: ` +client.id);
  }

  async handleDisconnect(client: AuthWithWs) {
    const sockets = this.server.sockets;

    this.logger.log(`Disconnected socket id: `+client.id);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

  }
  
// data { roomName : string, roomType : string, password? : string }
  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: any, payload: CreateChatDmRoomDto) {
    console.log("user id : ", client.id);
    const room = await this.chatService.createDmRoom(client, payload);
    client.join(room.name);
    this.server.to(room.name).emit('roomCreated', room);
  }

// data { roomName : string, roomType : string }
  @SubscribeMessage('getRooms')
  async handleGetRooms(client: any, payload: any) {
    console.log("The User ID Requesting Rooms : ", client.id)
    const rooms = await this.chatService.getRoomsByUserId(+client.id, {
        skip: client.handshake.query.skip ? +client.handshake.query.skip : 0,
        take: client.handshake.query.take ? +client.handshake.query.take : 10,
        cursor: client.handshake.query.cursor ? { id: +client.handshake.query.cursor } : undefined,
        where: client.handshake.query.where ? JSON.parse(client.handshake.query.where) : undefined,
      }
    );
    this.server.emit('listOfRooms', rooms);
  }

// data { roomName : string, roomType : string }
  @SubscribeMessage('getRoom')
  async handleGetRoom(client: any, payload: any) {
    const room = await this.chatService.getRoomByNames(payload.roomName, payload.roomType);
    console.log("room : ", room);
    this.server.emit('roomDetails', room);
  }

// data { roomName : string, password? : string } 
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: any, payload: any) {
    const room = await this.chatService.joinRoom(client, payload);
    client.join(payload.roomName);
    this.server.emit('roomJoined', room);
    const message = "New User " + client.id + " Joined Room " + payload.roomName;
    this.server.to(payload.roomName).emit('roomBroadcast', message);
  }


// data { roomName : string 
  @SubscribeMessage('getRoomUsers')
  async handleGetRoomUsers(client: any, payload: any) {
    const users = await this.chatService.getRoomUsers(payload.roomName,  {
      skip: client.handshake.query.skip ? +client.handshake.query.skip : 0,
      take: client.handshake.query.take ? +client.handshake.query.take : 10,
      cursor: client.handshake.query.cursor ? { id: +client.handshake.query.cursor } : undefined,
      where: client.handshake.query.where ? JSON.parse(client.handshake.query.where) : undefined,
    }
     );
    this.server.emit('listOfRoomMembers', users);
  }

  @SubscribeMessage('kick')
  async handleKick(client: any, payload: any) {
    const room = await this.chatService.kickUserFromRoom(client, payload);
    this.server.emit('roomBroadcast', "User Kicked");
  }

  @SubscribeMessage('mute')
  async handleMute(client: any, payload: any) {
    const room = await this.chatService.MuteUserFromRoom(client, payload);
    this.server.emit('roomBroadcast', "User Muted");
  }

  @SubscribeMessage('ban')
  async handleBan(client: any, payload: any) {
    const room = await this.chatService.BanUserFromRoom(client, payload);
    this.server.emit('roomBroadcast', "User Banned");
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('message', payload);
    return 'Hello world!';
  }
}


// Events       : [ listen      ] desc.
// ------------------------------------------------------------ [ server side ]
// creatRoom    : [ server side ] to create a room.
// getRooms     : [ server side ] to get all the rooms
// getRoom      : [ server side ] to get x room details
// joinRoom     : [ server side ] to join a room
// getRoomUsers : [ server side ] to get all the memebers of a room
// kick         : [ server side ] to kick a user from a room
// ------------------------------------------------------------ [ client side ]
// roomCreated  : [ client side ] retrive the new Room Details.
// listOfRooms  : [ client side ] retrive All the rooms for the user
// roomDetails  : [ client side ] retrive All the x room details
// roomJoined   : [ client side ] details about new room user joind
// listOfRoomMembers  : [ client side ] retrive All members of a room
// roomBroadcast: brodcast for room that user has joind or kicked or banned etc..

