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
    this.server.to(room.name).emit('newRoom', room);
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
    this.server.emit('rooms', rooms);
  }

// data { roomName : string, roomType : string }
  @SubscribeMessage('getRoom')
  async handleGetRoom(client: any, payload: any) {
    const room = await this.chatService.getRoomByNames(payload.roomName, payload.roomType);
    console.log("room : ", room);
    this.server.emit('room', room);
  }

// data { roomName : string, password? : string } 
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: any, payload: any) {
    const room = await this.chatService.joinRoom(client, payload);
    client.join(payload.roomName);
    this.server.emit('joined', room);
    const message = "New User " + client.id + " Joined Room " + payload.roomName;
    this.server.to(payload.roomName).emit('room', message);
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
    this.server.emit('roomUsers', users);
  }

  @SubscribeMessage('kick')
  async handleKick(client: any, payload: any) {
    const room = await this.chatService.kickUserFromRoom(client, payload);
    this.server.emit('kicked', "User Kicked");
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('message', payload);
    return 'Hello world!';
  }
}


