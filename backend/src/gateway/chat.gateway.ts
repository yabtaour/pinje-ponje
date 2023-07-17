import {
  WebSocketGateway, WebSocketServer, 
  SubscribeMessage, MessageBody, 
  OnGatewayInit, WsResponse,
  OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './gateway.service';
import { Logger } from '@nestjs/common';

interface User {
  socket: string;
  status: string;
}


@WebSocketGateway({ namespace: 'gateway', cors: { credentials: true, origin: '*' } })
export class chatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // export class GatewayGateway {
  @WebSocketServer() wss : Server; // wss = WebSocketServer

  private Logger = new Logger('GatewayGateway');
  afterInit(server: Server) {
    this.Logger.log('Initialized!');
  }

  handleConnection(client: Socket) {
    console.log('client connected');
    this.Logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.Logger.log(`Client disconnected: ${client.id}`);
  }
  
  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, text: string): void {
    console.log('chatToServer');
    console.log(text);
    // return ({ event: 'msgToClient', data: text }); // safer than client.emit
    // This is equivalent to:
    // client.emit('msgToClient', text); // Send to sender but change the return type to void
    this.wss.emit('chatToClient', text); // Send to all connected clients
  }
}


// @WebSocketGateway({ namespace: 'gateway', cors: { credentials: true, origin: '*' } })
// export class GatewayGateway {
//   constructor(private readonly gatewayService: GatewayService) {}

//   map = new Map<number, User>();

//   @WebSocketServer()
//   server: Server;
  
//   handleConnection(client: any) {
//     console.log('client connected');
//     console.log(client.id);
//     // Initialize user data
//     this.map.set(client.id, { socket: client.id, status: 'offline' });
//   }

//   handleDisconnect(client: any) {
//     console.log('client disconnected');
//     // Remove user data on disconnect
//     this.map.delete(client.id);
//   }

//   @SubscribeMessage('online')
//   online(@MessageBody() id: number) {
//     console.log('online');
//     // Update user status to 'online'
//     const user = this.map.get(id);
//     if (user && user.status !== 'online') {
//       user.status = 'online';
//     this.server.emit('newConnection', { userId: user.socket, status: user.status });
//       // this.broadcastUserStatus(user);
//     }

//     return this.gatewayService.status(1);
//   }

//   @SubscribeMessage('chat message')
//   handleMessage(@MessageBody() message: string): string {
//     console.log('chat message');
//     console.log(message);
//     this.server.emit('chat message', message);
//     return message;
//   }
//   private broadcastUserStatus(user: User) {
//     // Broadcast the updated user status to all connected clients
//     this.server.emit('statusGateway', { userId: user.socket, status: user.status });
//   }
// }
