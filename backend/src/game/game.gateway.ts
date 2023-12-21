import { Inject, Injectable, UseFilters, forwardRef } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io'
import { GlobalExceptionFilter } from 'src/global-exception.filter';
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
  initializeClients: number[];
  
  constructor(
		@Inject(forwardRef(() => GameService))
		private gameService: GameService,
  ) {
    this.intializeArray = [];
    this.currentGames = new Map();
    this.initializeClients = [];
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
      if (this.currentGames.has(payload.gameId)) {
          throw new WsException("Game already initiated");
      }
    
      const clientIndex = this.initializeClients.findIndex((element) => {
        return (element == client.id);
      })
      if (clientIndex != -1)
        return ;
      else
        this.initializeClients.push(client.id);
    
      let firstIndex = this.intializeArray.findIndex((element) => {
        return (element === payload.gameId);
      });
      if (firstIndex != -1) {
        this.intializeArray.splice(firstIndex, 1);
        this.initializeClients.splice(clientIndex, 1);
        this.gameService.initializeGame(parseInt(client.id), payload);
      } else {
        this.intializeArray.push(payload.gameId);
      }
    }

    @SubscribeMessage('updatePlayerPosition')
    updatePlayerPosition(client: any, payload: {gameId: number, direction: string}): void {
      if (!payload || !payload.gameId || !payload.direction
        || typeof payload.gameId != "number" || typeof payload.direction != "string") {
          console.log("payload is not valid !", payload);
          throw new WsException("invalid payload");
        }
      this.gameService.updatePlayerPosition(parseInt(client.id), payload);
    }
    
    @SubscribeMessage('updateScore')
    updateScore(client: any, payload: {gameId: number}): void {
      if (!payload || !payload.gameId || typeof payload.gameId != "number") {
        console.log("payload is not valid !", payload);
        throw new WsException("invalid payload");        
      }
      this.gameService.updateScore(parseInt(client.id), payload.gameId);
    }

    async handleConnection(client: any) {
      const sockets = this.server.sockets;
			console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: any) {
      console.log(`Client disconnected: ${client.id}`);
      let gameId = 0;
      let opponentId = 0;
      for (const [gameIdH, gameState] of Object.entries(this.currentGames)) {
        if (gameState.player1 && gameState.player1.id == parseInt(client.id)) {
          gameId = parseInt(gameIdH);
          opponentId = parseInt(gameState.player2.id);
          return this.gameService.finishGame(opponentId, parseInt(client.id), gameId)
        } else if (gameState.player2 && gameState.player2.id == parseInt(client.id)) {
          gameId = parseInt(gameIdH);
          opponentId = parseInt(gameState.player1.id);
          return this.gameService.finishGame(opponentId, parseInt(client.id), gameId)
        }
      }
      console.log("khsrti awldi");
    }
}

