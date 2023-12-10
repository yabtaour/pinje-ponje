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

  currentGames: Map<number, GameState>;
  intializeArray: number[];
  
  constructor(
		@Inject(forwardRef(() => GameService))
		private gameService: GameService,
  ) {
    this.intializeArray = [];
    this.currentGames = new Map();
  }
  
    afterInit(server: Server) {
      console.log('GameGateway initialized');
    }


    @SubscribeMessage('initialize')
    initializeGame(client: any, payload: {gameId: number, ballVel: number, playerPos: number}) {
      if (!payload || !payload.gameId || !payload.playerPos || !payload.ballVel
          || typeof payload.gameId !== "number" || typeof payload.playerPos !== "number"
          || typeof payload.ballVel !== "number") {
        throw new WsException("Bad request");
      }
      this.intializeArray.push(payload.gameId);
      const firstIndex = this.intializeArray.findIndex((element) => {
        element === payload.gameId;
      });
      const lastIndex = this.intializeArray.lastIndexOf(payload.gameId);
      if (firstIndex != lastIndex && firstIndex != -1 && lastIndex != -1) {
        this.intializeArray.splice(firstIndex, 1);
        this.intializeArray.splice(lastIndex, 1);
        this.gameService.initializeGame(parseInt(client.id), payload)
      }
    }

    @SubscribeMessage('updatePlayerPosition')
    updatePlayerPosition(client: any, payload: {gameId: number, direction: string}): void {
      console.log(client);
      this.gameService.updatePlayerPosition(client.id, payload);
    }
    
    @SubscribeMessage('updateScore')
    updateScore(client: any, payload: {gameId: number}): void {
      if (!payload || !payload.gameId || typeof payload.gameId !== "number")
      this.gameService.updateScore(parseInt(client.id), payload.gameId);
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
