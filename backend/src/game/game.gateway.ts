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

  async afterInit(server: Server) {
  }

  @SubscribeMessage('initialize')
  async initializeGame(
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
      await this.gameService.initializeGame(parseInt(client.id), payload);
    } else {
      this.intializeArray.push(payload.gameId);
    }
  }

  @SubscribeMessage('updatePlayerPosition')
  async updatePlayerPosition(
    client: any,
    payload: { gameId: number; direction: string },
  ) {
    if (
      !payload ||
      !payload.gameId ||
      !payload.direction ||
      typeof payload.gameId != 'number' ||
      typeof payload.direction != 'string'
    ) {
      throw new WsException('invalid payload 1');
    }
    await this.gameService.updatePlayerPosition(parseInt(client.id), payload);
  }

  @SubscribeMessage('updateScore')
  async updateScore(client: any, payload: { gameId: number }) {
    if (!payload || !payload.gameId || typeof payload.gameId != 'number') {
      throw new WsException('invalid payload 2');
    }
    await this.gameService.updateScore(parseInt(client.id), payload.gameId);
  }

  @SubscribeMessage('updateBallPosition')
  async updateBall(
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
    await this.gameService.updateBallPosition(parseInt(client.id), payload);
  }

  @SubscribeMessage('testingBallUpdate')
  async testingBallUpdate(
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
    await this.gameService.testingBallUpdate(parseInt(client.id), payload);
  }

  @SubscribeMessage('finishGame')
  async finishGame(client: any, payload: { gameId: number; enemy: number }) {
    if (
      !payload ||
      !payload.gameId ||
      !payload.enemy ||
      typeof payload.gameId != 'number' ||
      typeof payload.enemy != 'number'
    ) {
      throw new WsException('Invalid payload 5');
    }
    this.gameService.finishGame(
      payload.enemy,
      parseInt(client.id),
      payload.gameId,
    );
  }

  async handleConnection(client: any) {
    const sockets = this.server.sockets;
  }

  async handleDisconnect(client: any) {
  }

}