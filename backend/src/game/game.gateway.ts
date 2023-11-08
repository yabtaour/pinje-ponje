import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { AuthWithWs } from 'src/chat/dto/user-ws-dto';
import { Client } from 'socket.io/dist/client';

type gamePayload = {
  keyClick
}

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*'
  }
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  
  constructor(
    // private readonly gameService: GameService,
    // logger: Logger = new Logger('GameGateway'),
  ) {}
  
    afterInit(server: Server) {
      console.log('GameGateway initialized');
    }
    
    @SubscribeMessage('queue')
    handleMessage(client: any, payload: any): string {
      client.emit('queue', 'Hello world!');
      return 'Hello world!';
    }

    // @SubscribeMessage('game')
    // handleMessage(client: any, payload:)
    
    async handleConnection(client: AuthWithWs) {
      const sockets = this.server.sockets;
      // const rooms = await this.gameService.getRooms();
    }
    
    handleDisconnect(client: AuthWithWs) {
      console.log(`Client disconnected: ${client.id}`);
    }
}
