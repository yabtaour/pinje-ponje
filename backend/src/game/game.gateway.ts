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
  initializeClients: string[];
  
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
      console.log("chi haja jaaaaat");
      console.log(payload);
      if (!payload || !payload.gameId || !payload.playerPos || !payload.ballVel
          || typeof payload.gameId !== "number" || typeof payload.playerPos !== "number"
          || typeof payload.ballVel !== "number") {
        throw new WsException("Bad request");
      }
      const clientIndex = this.initializeClients.findIndex((element) => {
        return (element == client.id);
      })
      // if (clientIndex != -1)
      //   return;
      this.initializeClients.push(client.id);
      if (this.currentGames.has(payload.gameId)) {
        console.log("KHOUYA TA MALK BAGHI TGUEDDED");
          throw new WsException("Game already initiated");
      }
      this.intializeArray.push(payload.gameId);
      console.log(this.intializeArray);
      const firstIndex = this.intializeArray.findIndex((element) => {
        return (element === payload.gameId);
      });
      const lastIndex = this.intializeArray.lastIndexOf(payload.gameId);
      console.log(firstIndex, "|", lastIndex);
      if (firstIndex != lastIndex && firstIndex != -1 && lastIndex != -1) {
        console.log("2 players for now");
        this.intializeArray.splice(firstIndex, 1);
        this.intializeArray.splice(lastIndex, 1);
        this.gameService.initializeGame(parseInt(client.id), payload)
      }
    }

    @SubscribeMessage('updatePlayerPosition')
    updatePlayerPosition(client: any, payload: {gameId: number, direction: string}): void {
      console.log(client);
      console.log(payload);
      this.gameService.updatePlayerPosition(parseInt(client.id), payload);
    }
    
    @SubscribeMessage('updateScore')
    updateScore(client: any, payload: {gameId: number}): void {
      if (!payload || !payload.gameId || typeof payload.gameId !== "number")
      this.gameService.updateScore(parseInt(client.id), payload.gameId);
    }

    async handleConnection(client: AuthWithWs) {
      const sockets = this.server.sockets;
			console.log(`Client connected: ${client.id}`);
			// console.log(this.server);
    }
    
    handleDisconnect(client: AuthWithWs) {
      console.log(`Client disconnected: ${client.id}`);
    }
}
