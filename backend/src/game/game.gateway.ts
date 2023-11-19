import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthWithWs } from 'src/chat/dto/user-ws-dto';
import { GameState } from './gameState';
import { GameService } from './game.service';
import { ArgumentMetadata, Inject, Injectable, PipeTransform, UsePipes, forwardRef } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { UpdateBallPositionDto, UpdatePaddlePositionDto, UpdateScoreDto } from './dto/game.dto';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*'
  }
})

@Injectable()
export class PayloadValidationPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (!this.isValidPayload(value)) {
      throw new WsException('Invalid payload');
    }
    return value;
  }

	private isValidPayload(payload: UpdatePaddlePositionDto): boolean {
    if (!payload) {
			return false;
		}
		if (payload.gameId === undefined || payload.gameId === null
			|| payload.direction === undefined || payload.direction === null) {
			return false;
		}
    return true;
	}
}

export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  currentGames: Map<number, GameState> = new Map(); // key: gameId, value: GameState
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

    // @SubscribeMessage('spectate')
    // spectate(client: any, payload: {userId: number, gameId: number}): void {
    //   this.spectators.set(payload.gameId, payload.userId);
    // }

    @SubscribeMessage('updatePlayerPosition')
		// @UsePipes(new PayloadValidationPipe())
    updatePlayerPosition(client: any, payload: UpdatePaddlePositionDto): void {
      console.log(client);
      this.gameService.updatePlayerPosition(client.id, payload);
    }
  
    // @SubscribeMessage('updateBallPosition')
    // updateBallPosition(client: any, payload: UpdateBallPositionDto): void {
    //   this.gameService.updateBallPosition(payload);
    // }

    @SubscribeMessage('gameOver')
    gameOver(client: any, payload: {gameId: number}): void {
      this.gameService.gameOver(payload.gameId);
    }
    
    @SubscribeMessage('updateScore')
    updateScore(client: any, payload: UpdateScoreDto): void {
      console.log(payload);
      this.gameService.updateScore(payload.userId, payload.gameId);
    }
    // @SubscribeMessage('game')
    // handleMessage(client: any, payload:)
    
    async handleConnection(client: AuthWithWs) {
      const sockets = this.server.sockets;
			console.log(`Client connected: ${client.id}`);
			console.log(this.server);
      // const rooms = await this.gameService.getRooms();
    }
    
    handleDisconnect(client: AuthWithWs) {
      console.log(`Client disconnected: ${client.id}`);
    }
}
