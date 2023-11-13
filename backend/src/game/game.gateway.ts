import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthWithWs } from 'src/chat/dto/user-ws-dto';
import { GameState } from './gameState';
import { GameService } from './game.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*'
  }
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  
  currentGames: Map<number, GameState> = new Map(); // key: gameId, value: GameState
  spectators: Map<number, number> = new Map(); // key: gameId, value: userId)

  constructor(
		@Inject(forwardRef(() => GameService))
		private gameService: GameService,
    // private  gameService: GameService,
    // logger: Logger = new Logger('GameGateway')
  ) {}
  
    afterInit(server: Server) {
      console.log('GameGateway initialized');
    }
    
    @SubscribeMessage('queue')
    handleMessage(client: any, payload: any): string {
      client.emit('queue', 'Hello world!');
      return 'Hello world!';
    }

    @SubscribeMessage('spectate')
    spectate(client: any, payload: {userId: number, gameId: number}): void {
      this.spectators.set(payload.gameId, payload.userId);
    }

    @SubscribeMessage('updatePlayerPosition')
    updatePlayerPosition(client: any, payload: {direction: "up" | "down"}): void {
      console.log(client);
      this.gameService.updatePlayerPosition(client.id, payload.direction);
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
