import {
  WebSocketGateway, WebSocketServer, 
  SubscribeMessage, MessageBody, 
  OnGatewayInit, WsResponse,
  OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';


@WebSocketGateway({ namespace: 'alert', cors: { credentials: true, origin: '*' } })
export class alertGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss : Server; // wss = WebSocketServer

    private Logger = new Logger('alertGateway');
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

    sendToAll() {
        this.wss.emit('alertToClient', {type: 'alert'});
    }
}