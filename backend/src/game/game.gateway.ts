import { Inject, Injectable, UseFilters, forwardRef } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthWithWs } from 'src/chat/dto/user-ws-dto';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { UpdatePaddlePositionDto, UpdateScoreDto } from './dto/game.dto';
import { GameService } from './game.service';
import { GameState } from './gameState';

@UseFilters(new GlobalExceptionFilter())
@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*'
  }
})
@Injectable()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  currentGames: Map<number, GameState> = new Map(); // key: gameId, value: GameState
  intializeArray: number[];
  
  constructor(
		@Inject(forwardRef(() => GameService))
		private gameService: GameService,
  ) {
    this.intializeArray = [];
  }
  
    afterInit(server: Server) {
      console.log('GameGateway initialized');
    }

    
    @SubscribeMessage('queue')
    handleMessage(client: any, payload: any): string {
      client.emit('queue', 'Hello world!');
      return 'Hello world!';
    }

    @SubscribeMessage('initialize')
    initializeGame(client: any, payload: any) {
      try {
        console.log(payload);
        if (!parseInt(payload.gameId) || !parseFloat(payload.playerPos))
          throw new WsException("Bad request");
        } catch {
          throw new WsException("Bad request");
      }
      console.log(this.intializeArray)
      this.intializeArray.push(payload.gameId);
      console.log(this.intializeArray);
      console.log("meh")
      const firstIndex = this.intializeArray.findIndex((element) => {
        element === parseInt(payload.gameId);
      });
      console.log("first index : ", firstIndex);
      const lastIndex = this.intializeArray.lastIndexOf(parseInt(payload.gameId));
      console.log(firstIndex, lastIndex);
      if (firstIndex != lastIndex)
        this.gameService.initializeGame(Number(client.id), payload)
    }

    @SubscribeMessage('updatePlayerPosition')
    updatePlayerPosition(client: any, payload: UpdatePaddlePositionDto): void {
      console.log(client);
      this.gameService.updatePlayerPosition(client.id, payload);
    }
  
    @SubscribeMessage('gameOver')
    // gameOver(client: any, payload: {gameId: number}): void {
    //   this.gameService.gameOver(payload.gameId);
    // }
    
    @SubscribeMessage('updateScore')
    updateScore(client: any, payload: UpdateScoreDto): void {
      console.log(payload);
      console.log(client);
      this.gameService.updateScore(payload.userId, payload.gameId);
    }

    async handleConnection(client: AuthWithWs) {
      const sockets = this.server.sockets;
			console.log(`Client connected: ${client.id}`);
			console.log(this.server);
    }
    
    handleDisconnect(client: AuthWithWs) {
      console.log(`Client disconnected: ${client.id}`);
    }
}
