import { Inject, Injectable, UseFilters, forwardRef } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { GameService } from './game.service';
import { GameState } from './gameState';

export let currentGames: Map<number, GameState>;

@UseFilters(new GlobalExceptionFilter())
@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // currentGames: Map<number, GameState>;
  intializeArray: number[];
  initializeClients: number[];

  constructor(
    @Inject(forwardRef(() => GameService))
    private gameService: GameService,
  ) {
    this.intializeArray = [];
    currentGames = new Map();
    this.initializeClients = [];
  }

  afterInit(server: Server) {
    console.log('GameGateway initialized');
  }

  @SubscribeMessage('initialize')
  initializeGame(
    client: any,
    payload: { gameId: number; ballVel: number; playerPos: number },
  ) {
    if (
      !payload ||
      !payload.gameId ||
      !payload.playerPos ||
      !payload.ballVel ||
      typeof payload.gameId !== 'number' ||
      typeof payload.playerPos !== 'number' ||
      typeof payload.ballVel !== 'number'
    ) {
      throw new WsException('Bad request');
    }
    if (currentGames.has(payload.gameId)) {
      throw new WsException('Game already initiated');
    }

    const clientIndex = this.initializeClients.findIndex((element) => {
      return element == client.id;
    });
    if (clientIndex != -1) return;
    else this.initializeClients.push(client.id);

    let firstIndex = this.intializeArray.findIndex((element) => {
      return element === payload.gameId;
    });
    if (firstIndex != -1) {
      this.gameService.initializeGame(parseInt(client.id), payload);
    } else {
      this.intializeArray.push(payload.gameId);
    }
  }

  @SubscribeMessage('updatePlayerPosition')
  updatePlayerPosition(
    client: any,
    payload: { gameId: number; direction: string },
  ): void {
    if (
      !payload ||
      !payload.gameId ||
      !payload.direction ||
      typeof payload.gameId != 'number' ||
      typeof payload.direction != 'string'
    ) {
      console.log('payload is not valid !', payload);
      throw new WsException('invalid payload 1');
    }
    this.gameService.updatePlayerPosition(parseInt(client.id), payload);
  }

  @SubscribeMessage('updateScore')
  updateScore(client: any, payload: { gameId: number }): void {
    if (!payload || !payload.gameId || typeof payload.gameId != 'number') {
      console.log('payload is not valid !', payload);
      throw new WsException('invalid payload 2');
    }
    console.log('update score : ', payload, client.id);
    this.gameService.updateScore(parseInt(client.id), payload.gameId);
  }

  @SubscribeMessage('updateBallPosition')
  updateBall(
    client: any,
    payload: {
      gameId: number;
      position: any;
      velocity: any;
      edge: string;
      worldWidth: number;
    },
  ) {
    if (
      !payload ||
      !payload.gameId ||
      !payload.position ||
      !payload.edge ||
      !payload.velocity ||
      typeof payload.gameId != 'number'
    ) {
      throw new WsException('invalid payload 3');
    }
    this.gameService.updateBallPosition(parseInt(client.id), payload);
  }

  @SubscribeMessage('testingBallUpdate')
  testingBallUpdate(
    client: any,
    payload: {
      gameId: number;
      position: any;
      velocity: any;
      edge: string;
      worldWidth: number;
    },
  ) {
    if (
      !payload ||
      !payload.gameId ||
      !payload.position ||
      !payload.edge ||
      !payload.velocity ||
      typeof payload.gameId != 'number'
    ) {
      throw new WsException('invalid payload 4');
    }
    this.gameService.testingBallUpdate(parseInt(client.id), payload);
  }

  @SubscribeMessage('finishGame')
  finishGame(client: any, payload: { gameId: number; enemy: number }) {
    console.log('hadi : ', payload);
    if (
      !payload ||
      !payload.gameId ||
      !payload.enemy ||
      typeof payload.gameId != 'number' ||
      typeof payload.enemy != 'number'
    ) {
      throw new WsException('Invalid payload 5');
    }
    console.log(payload);
    this.gameService.finishGame(
      payload.enemy,
      parseInt(client.id),
      payload.gameId,
    );
  }

  async handleConnection(client: any) {
    const sockets = this.server.sockets;
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    console.log('khsrti awldi');
  }

}
