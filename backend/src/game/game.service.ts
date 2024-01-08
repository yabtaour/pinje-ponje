import {
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	forwardRef,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { NotificationType, Rank, Status } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameGateway, currentGames } from './game.gateway';
import { GameState } from './gameState';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
  ) {}

  async getWinRateByUserId(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new HttpException(`No user found`, HttpStatus.BAD_REQUEST);
    const wonGamesCount = await this.prisma.game.count({
      where: {
        players: {
          some: {
            userId: id,
            status: 'WINNER',
          },
        },
      },
    });
    const lostGamesCount = await this.prisma.game.count({
      where: {
        players: {
          some: {
            userId: id,
            status: 'LOSER',
          },
        },
      },
    });
    const winRate = (wonGamesCount / (wonGamesCount + lostGamesCount)) * 100;
    return {
      wonGamesCount: wonGamesCount,
      lostGamesCount: lostGamesCount,
      winRate: winRate,
    };
  }

  async getGamesByUserId(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new HttpException(`No user found`, HttpStatus.BAD_REQUEST);
    const games = await this.prisma.game.findMany({
      where: {
        players: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        players: {
          select: {
            status: true,
            score: true,
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!games)
      throw new HttpException(`No games found`, HttpStatus.BAD_REQUEST);
    return games;
  }

  async getGames() {
    const games = await this.prisma.game.findMany({
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!games)
      throw new HttpException(`No games found`, HttpStatus.BAD_REQUEST);
    return games;
  }

  async getGameById(id: number) {
    const game = await this.prisma.game.findUnique({
      where: {
        id: id,
      },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!game) throw new HttpException(`No game found`, HttpStatus.BAD_REQUEST);
    return game;
  }

  async invitePlayer(data: { userId: number }, user: any) {
    if (user.status == Status.INGAME || user.status == Status.OFFLINE)
      throw new HttpException(`User is not available`, HttpStatus.BAD_REQUEST);
    if (user.id === data.userId)
      throw new HttpException(
        `You can't invite yourself`,
        HttpStatus.BAD_REQUEST,
      );
    const opponent = await this.prisma.user.findFirst({
      where: {
        id: data.userId,
        status: {
          in: ['ONLINE', 'INQUEUE'],
        },
      },
    });
    if (!opponent)
      throw new HttpException(
        `No user with id ${data.userId} is available`,
        HttpStatus.BAD_REQUEST,
      );
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        gameInvitesSent: data.userId,
      },
    });
    this.notificationService.create({
      senderId: user.id,
      receiverId: opponent.id,
      type: NotificationType.GAME_INVITE,
    });
  }

  async acceptInvite(data: { userId: number }, user: any) {
    if (user.status == Status.INGAME || user.status == Status.OFFLINE)
      throw new HttpException(`You are not available`, HttpStatus.BAD_REQUEST);
    if (user.id === data.userId)
      throw new HttpException(
        `You can't play with yourself`,
        HttpStatus.BAD_REQUEST,
      );

    const opponent = await this.prisma.user.findFirst({
      where: {
        id: data.userId,
        status: {
          in: ['ONLINE', 'INQUEUE'],
        },
      },
    });
    if (!opponent)
      throw new HttpException(
        `No user with id ${data.userId} is available`,
        HttpStatus.BAD_REQUEST,
      );
    if (opponent.gameInvitesSent !== user.id)
      throw new HttpException(`No invite found`, HttpStatus.BAD_REQUEST);
    await this.prisma.user.update({
      where: {
        id: opponent.id,
      },
      data: {
        gameInvitesSent: null,
      },
    });
    const game = await this.prisma.game.create({
      data: {
        mode: 'VSONE',
        players: {
          create: [
            { status: 'LOSER', user: { connect: { id: user.id } } },
            { status: 'LOSER', user: { connect: { id: opponent.id } } },
          ],
        },
      },
      select: {
        id: true,
        players: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!game)
      throw new HttpException(`Error creating game`, HttpStatus.BAD_REQUEST);
    const player = await this.prisma.player.findFirst({
      where: {
        userId: user.id,
        gameId: game.id,
      },
    });
    if (!player)
      throw new HttpException(`No player found`, HttpStatus.BAD_REQUEST);
    const opponentPlayer = await this.prisma.player.findFirst({
      where: {
        userId: opponent.id,
        gameId: game.id,
      },
    });
    if (!opponentPlayer)
      throw new HttpException(
        `No opponent player found`,
        HttpStatus.BAD_REQUEST,
      );

    await this.prisma.user.updateMany({
      where: {
        id: {
          in: [user.id, data.userId],
        },
      },
      data: {
        status: 'INGAME',
      },
    });

    await this.gameGateway.server
      .to(String(player.userId))
      .emit('gameFound', { game: game });
    await this.gameGateway.server
      .to(String(opponentPlayer.userId))
      .emit('gameFound', { game: game });
  }

  async declineInvite(data: { userId: number }, currentUser: any) {
    const opponent = await this.prisma.user.findFirst({
      where: {
        id: data.userId,
        status: {
          in: ['ONLINE', 'INQUEUE'],
        },
      },
    });
    if (!opponent)
      throw new HttpException(
        `No user with id ${data.userId} is available`,
        HttpStatus.BAD_REQUEST,
      );
    if (opponent.gameInvitesSent !== currentUser.id)
      throw new HttpException(`No invite found`, HttpStatus.BAD_REQUEST);
    await this.prisma.user.update({
      where: {
        id: opponent.id,
      },
      data: {
        gameInvitesSent: null,
      },
    });
    this.notificationService.create({
      senderId: currentUser.id,
      receiverId: opponent.id,
      type: NotificationType.GAME_INVITE_REJECTED,
    });
  }

  // game queue
  async findGame(user: any) {
    if (user.status == Status.INGAME || user.status == Status.OFFLINE)
      throw new HttpException(`User is not available`, HttpStatus.BAD_REQUEST);
    const opponent = await this.prisma.user.findFirst({
      where: {
        id: {
          not: user.id,
        },
        status: 'INQUEUE',
      },
    });

    if (!opponent) {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          status: 'INQUEUE',
        },
      });
      return;
    }

    const game = await this.prisma.game.create({
      data: {
        mode: 'VSONE',
        players: {
          create: [
            { status: 'LOSER', user: { connect: { id: user.id } } },
            { status: 'LOSER', user: { connect: { id: opponent.id } } },
          ],
        },
      },
      select: {
        id: true,
        players: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!game)
      throw new HttpException(`Error creating game`, HttpStatus.BAD_REQUEST);

    const player = await this.prisma.player.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: game.id,
        },
      },
    });
    if (!player)
      throw new HttpException(`Error creating players`, HttpStatus.BAD_REQUEST);

    const opponentPlayer = await this.prisma.player.findUnique({
      where: {
        userId_gameId: {
          userId: opponent.id,
          gameId: game.id,
        },
      },
    });
    if (!opponentPlayer)
      throw new HttpException(`Error creating players`, HttpStatus.BAD_REQUEST);

    await this.prisma.user.updateMany({
      where: {
        id: {
          in: [user.id, opponent.id],
        },
      },
      data: {
        status: 'INGAME',
      },
    });
    await this.gameGateway.server
      .to(String(player.userId))
      .emit('gameFound', { game: game, id: player.userId });
    await this.gameGateway.server
      .to(String(opponentPlayer.userId))
      .emit('gameFound', { game: game, id: opponentPlayer.userId });
  }

  async initializeGame(client: number, payload: any) {
    const player = await this.prisma.player.findUnique({
      where: {
        userId_gameId: {
          userId: client,
          gameId: payload.gameId,
        },
      },
      include: {
        game: {
          include: {
            players: {
              where: {
                userId: {
                  not: client,
                },
              },
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    const opponentPlayer = player.game.players.map(
      (otherPlayer) => otherPlayer.user,
    );
    const gameState = new GameState(
      {
        id: client,
        paddlePosition: payload.playerPos,
        score: 0,
        reversed: false,
      },
      {
        id: opponentPlayer[0].id,
        paddlePosition: payload.playerPos,
        score: 0,
        reversed: true,
      },
      { x: payload.ballVel, y: payload.ballVel },
    );
    currentGames.set(payload.gameId, gameState);
    this.gameGateway.server
      .to(String(currentGames.get(payload.gameId)?.player1.id))
      .emit('startGame', { reversed: false });
    this.gameGateway.server
      .to(String(currentGames.get(payload.gameId)?.player2.id))
      .emit('startGame', { reversed: true });
  }

  async updatePlayerPosition(client: number, payload: any) {
    // const currentPlayer = await this.prisma.player.findUnique({
    // 	where: {
    // 		userId_gameId: {
    // 			userId: Number(client),
    // 			gameId: payload.gameId,
    // 		},
    // 	},
    // });
    // if (!currentPlayer)
    // 	throw new WsException(`No player found`);
    if (currentGames.has(payload.gameId)) {
      await this.gameGateway.server
        .to(String(currentGames.get(payload.gameId)?.player1.id))
        .emit('updatePaddle', {
          playerId: client,
          direction: payload.direction,
        });

      await this.gameGateway.server
        .to(String(currentGames.get(payload.gameId)?.player2.id))
        .emit('updatePaddle', {
          playerId: client,
          direction: payload.direction,
        });
    }
  }

  async updateBallPosition(
    client: number,
    payload: {
      gameId: number;
      position: any;
      velocity: any;
      edge: string;
      worldWidth: number;
    },
  ) {
    if (currentGames.has(payload.gameId)) {
      if (currentGames.get(payload.gameId)?.player1.id == client) {
        if (currentGames.get(payload.gameId)?.player1.reversed == false) {
          let velocity = null;
          if (payload.edge == 'floor') {
            velocity = {
              x: payload.velocity.x,
              y: payload.velocity.y * -1,
            };
          } else if (payload.edge == 'paddle') {
            velocity = {
              x: payload.velocity.x * -1,
              y: payload.velocity.y,
            };
          }
          await this.gameGateway.server
            .to(String(currentGames.get(payload.gameId)?.player1.id))
            .emit('updateBall', {
              position: payload.position,
              velocity: velocity,
            });
          // if (payload.edge == "floor" || payload.edge == "paddle") {
          // 	velocity = {
          // 		x: payload.velocity.x * -1,
          // 		y: payload.velocity.y * -1,
          // 	}
          // }
          if (payload.edge == 'floor') {
            velocity = {
              x: payload.velocity.x * -1,
              y: payload.velocity.y * -1,
            };
          } else if (payload.edge == 'paddle') {
            velocity = {
              x: payload.velocity.x,
              y: payload.velocity.y,
            };
          }
          const position = {
            x: payload.worldWidth - payload.position.x,
            y: payload.position.y,
          };
          await this.gameGateway.server
            .to(String(currentGames.get(payload.gameId)?.player2.id))
            .emit('updateBall', { position: position, velocity: velocity });
        }
      } else if (currentGames.get(payload.gameId)?.player2.id == client) {
        if (currentGames.get(payload.gameId)?.player2.reversed == false) {
          let velocity = null;
          if (payload.edge == 'floor') {
            velocity = {
              x: payload.velocity.x,
              y: payload.velocity.y * -1,
            };
          } else if (payload.edge == 'paddle') {
            velocity = {
              x: payload.velocity.x * -1,
              y: payload.velocity.y,
            };
          }
          await this.gameGateway.server
            .to(String(currentGames.get(payload.gameId)?.player2.id))
            .emit('updateBall', {
              position: payload.position,
              velocity: velocity,
            });
          if (payload.edge == 'floor') {
            velocity = {
              x: payload.velocity.x * -1,
              y: payload.velocity.y * -1,
            };
          } else if (payload.edge == 'paddle') {
            velocity = {
              x: payload.velocity.x,
              y: payload.velocity.y,
            };
          }
          const position = {
            x: payload.worldWidth - payload.position.x,
            y: payload.position.y,
          };
          // if (payload.edge == "floor" || payload.edge == "paddle") {
          // 		velocity = {
          // 			x: payload.velocity.x * -1,
          // 			y: payload.velocity.y * -1,
          // 		}
          // }
          await this.gameGateway.server
            .to(String(currentGames.get(payload.gameId)?.player1.id))
            .emit('updateBall', { position: position, velocity: velocity });
        }
      } else {
        throw new WsException('Player Not found');
      }
    }
  }

  async testingBallUpdate(
    client: number,
    payload: {
      gameId: number;
      position: any;
      velocity: any;
      edge: string;
      worldWidth: number;
    },
  ) {
    if (currentGames.has(payload.gameId)) {
      if (currentGames.get(payload.gameId)?.player1.id == client) {
        if (currentGames.get(payload.gameId)?.player1.reversed == false) {
          let velocity = null;
          velocity = {
            x: payload.velocity.x * -1,
            y: payload.velocity.y,
          };
          const position = {
            x: payload.worldWidth - payload.position.x,
            y: payload.position.y,
          };
          await this.gameGateway.server
            .to(String(currentGames.get(payload.gameId)?.player2.id))
            .emit('updateBall', { position: position, velocity: velocity });
        }
      } else if (currentGames.get(payload.gameId)?.player2.id == client) {
        if (currentGames.get(payload.gameId)?.player2.reversed == false) {
          let velocity = null;
          velocity = {
            x: payload.velocity.x * -1,
            y: payload.velocity.y,
          };
          const position = {
            x: payload.worldWidth - payload.position.x,
            y: payload.position.y,
          };
          await this.gameGateway.server
            .to(String(currentGames.get(payload.gameId)?.player1.id))
            .emit('updateBall', { position: position, velocity: velocity });
        }
      } else {
        throw new WsException('Player Not found');
      }
    }
  }


  async finishGame(winnerId: number, loserId: number, gameId: number) {
    if (currentGames.has(gameId)) {
      currentGames.delete(gameId);
      const winner = await this.prisma.player.update({
        where: {
          userId_gameId: {
            userId: Number(winnerId),
            gameId: gameId,
          },
        },
        data: {
          status: 'WINNER',
          accuracy: 10,
          reflex: 10,
          consitency: 10,
        },
      });
      const loser = await this.prisma.player.update({
        where: {
          userId_gameId: {
            userId: Number(loserId),
            gameId: gameId,
          },
        },
        data: {
          status: 'LOSER',
        },
      });
      if (!winner || !loser)
        throw new HttpException(
          `Error updating players`,
          HttpStatus.BAD_REQUEST,
        );
      const winnerUser = await this.prisma.user.findUnique({
        where: {
          id: winnerId,
        },
      });
      const newWinnerConsitensy =
        (await winnerUser).consitency + winner.consitency > 100
          ? 100
          : (await winnerUser).consitency + winner.consitency;
      const newWinnerReflex =
        (await winnerUser).reflex + winner.reflex > 100
          ? 100
          : (await winnerUser).reflex + winner.reflex;
      const newWinnerAccuracy =
        (await winnerUser).accuracy + winner.accuracy > 100
          ? 100
          : (await winnerUser).accuracy + winner.accuracy;
      const newXp =
        (await winnerUser).experience + 25 >= (await winnerUser).level * 100
          ? 0
          : (await winnerUser).experience + 25;
      const newGamePoints =
        (await winnerUser).gamePoints + 20 >= 100
          ? 0
          : (await winnerUser).gamePoints + 20;

      let newLevel = (await winnerUser).level;
      if (newXp == 0) newLevel = (await winnerUser).level + 1;

      let nextRank = (await winnerUser).rank;
      if (newGamePoints == 0) {
        const ranks = Object.values(Rank);
        const currentIndex = ranks.indexOf((await winnerUser).rank);
        if (currentIndex === -1 || currentIndex === ranks.length - 1) {
          nextRank = (await winnerUser).rank;
        }
        nextRank = ranks[currentIndex + 1];
      }

      await this.prisma.user.update({
        where: {
          id: winnerId,
        },
        data: {
          status: 'ONLINE',
          consitency: newWinnerConsitensy,
          reflex: newWinnerReflex,
          accuracy: newWinnerAccuracy,
          level: newLevel,
          experience: newXp,
          gamePoints: newGamePoints,
          rank: nextRank,
        },
      });
      await this.prisma.user.update({
        where: {
          id: loserId,
        },
        data: {
          status: 'ONLINE',
        },
      });

      this.gameGateway.initializeClients.splice(
        this.gameGateway.initializeClients.findIndex((element) => {
          element == winnerId;
        }),
        1,
      );
      this.gameGateway.initializeClients.splice(
        this.gameGateway.initializeClients.findIndex((element) => {
          element == loserId;
        }),
        1,
      );
      this.gameGateway.intializeArray.splice(
        this.gameGateway.intializeArray.findIndex((element) => {
          element == gameId;
        }),
        1,
      );
      // currentGames.delete(gameId);
      this.gameGateway.initializeClients.splice(
        this.gameGateway.initializeClients.findIndex((element) => {
          element == winnerId;
        }),
        1,
      );
      this.gameGateway.initializeClients.splice(
        this.gameGateway.initializeClients.findIndex((element) => {
          element == loserId;
        }),
        1,
      );
      this.gameGateway.intializeArray.splice(
        this.gameGateway.intializeArray.findIndex((element) => {
          element == gameId;
        }),
        1,
      );
      currentGames.delete(gameId);
      await this.gameGateway.server
        .to(String(winnerId))
        .emit('gameOver', 'win');
      await this.gameGateway.server
        .to(String(loserId))
        .emit('gameOver', 'loss');
    }
  }

  async updateScore(userId: number, gameId: number) {

    if (currentGames.has(gameId)) {
      if (userId === currentGames.get(gameId).player1.id) {
        currentGames.get(gameId).player2.score++;
        if (currentGames.get(gameId).player2.score >= 5) {
          this.finishGame(currentGames.get(gameId).player2.id, userId, gameId);
          return;
        }
        await this.gameGateway.server.to(String(userId)).emit('updateScore', {
          player: userId,
          newScore: currentGames.get(gameId).player2.score,
        });
        await this.gameGateway.server
          .to(String(currentGames.get(gameId).player2.id))
          .emit('updateScore', {
            player: userId,
            newScore: currentGames.get(gameId).player2.score,
          });
      } else if (userId === currentGames.get(gameId).player2.id) {
        currentGames.get(gameId).player1.score++;
        if (currentGames.get(gameId).player1.score >= 5) {
          this.finishGame(currentGames.get(gameId).player1.id, userId, gameId);
          return;
        }
        await this.gameGateway.server
          .to(String(currentGames.get(gameId).player1.id))
          .emit('updateScore', {
            player: userId,
            newScore: currentGames.get(gameId).player1.score,
          });
        await this.gameGateway.server.to(String(userId)).emit('updateScore', {
          player: userId,
          newScore: currentGames.get(gameId).player1.score,
        });
      } else {
        throw new WsException('No player found');
      }
    }
  }

  async handleClientDisconnect(client: number, gameId: number) {
    const game = currentGames.get(gameId);
    const winnerId =
      client == game.player1.id ? game.player2.id : game.player1.id;
    this.finishGame(winnerId, client, gameId);
  }
}