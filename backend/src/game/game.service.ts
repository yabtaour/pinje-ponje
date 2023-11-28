import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType, Status } from '@prisma/client';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { GameGateway } from './game.gateway';
import { GameState } from './gameState';
import { UpdatePaddlePositionDto } from './dto/game.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GameService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly gameGateway: GameGateway,
		private readonly notificationService: NotificationService,
		private readonly notificationGateway: NotificationGateway,
	) {}

	async getWinRateByUserId(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		if (!user)
			throw new HttpException(`No user found`, HttpStatus.BAD_REQUEST);
		const wonGamesCount = await this.prisma.game.count({
			where: {
				players: {
					some: {
						userId: id,
						status: "WINNER",
					},
				},
			},
		});
		const lostGamesCount = await this.prisma.game.count({
			where: {
				players: {
					some: {
						userId: id,
						status: "LOSER",
					},
				},
			},
		});
		const winRate = (wonGamesCount / (wonGamesCount + lostGamesCount)) * 100;
		return ({wonGamesCount: wonGamesCount, lostGamesCount: lostGamesCount, winRate: winRate});
	}

	async getGamesByUserId(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
		});
		if (!user)
			throw new HttpException(`No user found`, HttpStatus.BAD_REQUEST);
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
						}
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
		if (!game)
			throw new HttpException(`No game found`, HttpStatus.BAD_REQUEST);
		return game;
	}

	async invitePlayer(data: {userId: number}, user: any) {
		if (user.status == Status.INGAME || user.status == Status.OFFLINE)
			throw new HttpException(`User is not available`, HttpStatus.BAD_REQUEST);
		if (user.id === data.userId)
			throw new HttpException(`You can't invite yourself`, HttpStatus.BAD_REQUEST);
		const opponent = await this.prisma.user.findFirst({
			where: {
				id: data.userId,
				status: {
				 in: ["ONLINE", "INQUEUE"]
			 	}
			}
		});
		if (!opponent)
			throw new HttpException(`No user with id ${data.userId} is available`, HttpStatus.BAD_REQUEST);
		this.notificationGateway.sendNotificationToUser(
			String(opponent.id),
			{
				senderId: user.id,
				receiverId: opponent.id,
				type: NotificationType.GAME_INVITE,
			}
		);
	}

	async acceptInvite(data: {userId: number}, user: any) {
		if (user.status == Status.INGAME || user.status == Status.OFFLINE)
			throw new HttpException(`You are not available`, HttpStatus.BAD_REQUEST);
		if (user.id === data.userId)
			throw new HttpException(`You can't play with yourself`, HttpStatus.BAD_REQUEST);
		const opponent = await this.prisma.user.findFirst({
			where: {
				id: data.userId,
				status: {
				 in: ["ONLINE", "INQUEUE"]
			 	}
			}
		});
		const game = await this.prisma.game.create({
			data: {
				mode: 'VSONE',
				players: {
					create: [
						{ status: 'LOSER', user: { connect: { id: user.id } } },
						{ status: 'LOSER', user: { connect: { id: opponent.id } } },
					]
				}
			}
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
			throw new HttpException(`No opponent player found`, HttpStatus.BAD_REQUEST);

		await this.prisma.user.updateMany({
			where: {
				id: {
					in: [user.id, data.userId],
				},
			},
			data: {
				status: "INGAME"
			}
		});

		const gameState = new GameState(
			{id: player.userId, paddlePosition: 5, score: 0},
			{id: player.userId, paddlePosition: 5, score: 0},
			{x: 0, y: 0},
			{x: 0, y: 0},
		)
		this.gameGateway.currentGames[game.id] = gameState
		this.gameGateway.server.to(String(player.userId)).emit('gameStart', gameState);
		this.gameGateway.server.to(String(opponentPlayer.userId)).emit('gameStart', gameState);
	}

	async declineInvite(data: {userId: number}, user: any) {
		const opponent = await this.prisma.user.findFirst({
			where: {
				id: data.userId,
				status: {
				 in: ["ONLINE", "INQUEUE"]
			 	}
			}
		});
		if (!opponent)
			throw new HttpException(`No user with id ${data.userId} is available`, HttpStatus.BAD_REQUEST);

		this.notificationService.create({
			senderId: data.userId,
			receiverId:	user.id,
			type: NotificationType.GAME_INVITE_REJECTED,
		})
	}

	async findGame(user: any) {
		if (user.status == Status.INGAME || user.status == Status.OFFLINE)
			throw new HttpException(`User is not available`, HttpStatus.BAD_REQUEST);
		const opponent = await this.prisma.user.findFirst({
			where: {
				id: {
					not: user.id,
				},
				status: "INQUEUE"
			}
		});

		if (!opponent) {
			await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					status: "INQUEUE"
				}
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
					]
				}
			},
			// in case front want to add something before transferring to the game
			// select: {
			// 	id: true,
			// 	players: {
			// 		select: {
			// 			id: true,
			// 			userId: true,
			// 			user: {
			// 				select: {
			// 					id: true,
			// 					username: true,
			// 					profile: {
			// 						select: {
			// 							avatar: true,
			// 						},
			// 					},
			// 				},
			// 			},
			// 		},
			// 	},
			// },
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
		})
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
				status: "INGAME"
			}
		});

		const gameState = new GameState(
			{id: player.userId, paddlePosition: 5, score: 0},
			{id: opponentPlayer.userId, paddlePosition: 5, score: 0},
			{x: 0, y: 0},
			{x: 0, y: 0},
		)
		this.gameGateway.currentGames[game.id] = gameState;
		await this.gameGateway.server.to(String(opponentPlayer.userId)).emit('queue', gameState);
		await this.gameGateway.server.to(String(player.userId)).emit('gameStart', gameState);
		await this.gameGateway.server.to(String(opponentPlayer.userId)).emit('gameStart', gameState);

		console.log(this.gameGateway.currentGames);
	}

	async updatePlayerPosition(client: number, payload: UpdatePaddlePositionDto) {
		const currentPlayer = await this.prisma.player.findUnique({
			where: {
				userId_gameId: {
					userId: Number(client),
					gameId: payload.gameId,
				},
			},
		});
		if (!currentPlayer)
			throw new WsException(`No player found`);
			// throw new HttpException(`No player found`, HttpStatus.BAD_REQUEST);

		let actualPlayer = null;

		if (this.gameGateway.currentGames[payload.gameId].player1.id == client)
			actualPlayer = this.gameGateway.currentGames[payload.gameId].player1;
		else
			actualPlayer = this.gameGateway.currentGames[payload.gameId].player2;
		
		let actualPlayerPosition: number = await actualPlayer.paddlePosition;

		if (payload.direction === "up")
			actualPlayerPosition -= 1;
		else if (payload.direction === "down")
			actualPlayerPosition += 1;
		else
			throw new WsException(`Invalid direction`);
			// throw new HttpException(`Invalid direction`, HttpStatus.BAD_REQUEST);

		actualPlayer.paddlePosition = actualPlayerPosition;

		if (this.gameGateway.currentGames[payload.gameId].player1.id == client)
			this.gameGateway.currentGames[payload.gameId].player1 = actualPlayer;
		else
			this.gameGateway.currentGames[payload.gameId].player2 = actualPlayer;

		await this.gameGateway.server
				.to(String(this.gameGateway.currentGames[payload.gameId].player1.id))
				.emit('updatePlayerPosition', this.gameGateway.currentGames[payload.gameId]);

		await this.gameGateway.server
				.to(String(this.gameGateway.currentGames[payload.gameId].player2.id))
				.emit('updatePlayerPosition', this.gameGateway.currentGames[payload.gameId]);
	}

	async updateBallPosition(x: number, y: number, gameId: number) {
		this.gameGateway.currentGames[gameId].ball.x = x;
		this.gameGateway.currentGames[gameId].ball.y = y;
		await this.gameGateway.server.to(String(gameId)).emit('ballUpdate', {x: x, y: y});
	}

	async gameOver(gameId: number) {
		this.gameGateway.currentGames.delete(gameId);
		await this.gameGateway.server.to(String(gameId)).emit('gameOver');
	}


	async finishGame(winnerId: number, loserId: number, gameId: number) {
		await this.gameGateway.server.to(String(winnerId)).emit('gameOver', "YOU WON THE GAME !!! CONGRATULATIONS !!!");
		await this.gameGateway.server.to(String(loserId)).emit('gameOver', "YOU LOST THE GAME !!! GOOD LUCK NEXT TIME :( :( :(");
		await this.prisma.player.update({
			where: {
				userId_gameId: {
					userId: Number(winnerId),
					gameId: gameId,
				},
			},
			data: {
				status: "WINNER",
				accuracy: 10,
				reflex: 10,
				consitency: 10
			},
		});
		await this.prisma.player.update({
			where: {
				userId_gameId: {
					userId: Number(loserId),
					gameId: gameId,
				},
			},
			data: {
				status: "LOSER",
			},
		});
		await this.prisma.user.updateMany({
			where: {
				id: {
					in: [winnerId, loserId],
				},
			},
			data: {
				status: "ONLINE"
			}
		});
		this.gameGateway.currentGames.delete(gameId);
		console.log(this.gameGateway.currentGames);
	}

	async updateScore(userId: number, gameId: number) {
		const player = await this.prisma.player.findUnique({
			where: {
				userId_gameId: {
					userId: Number(userId),
					gameId: gameId,
				},
			},
		});
		if (!player)
			throw new WsException(`No player found`);
			// throw new HttpException(`No player found`, HttpStatus.BAD_REQUEST);

		let actualPlayer = null;
		let opponentPlayer = null;

		if (this.gameGateway.currentGames[player.gameId].player1.id == userId)
		{
			actualPlayer = this.gameGateway.currentGames[player.gameId].player1;
			opponentPlayer = this.gameGateway.currentGames[player.gameId].player2;
		}
		else
		{
			actualPlayer = this.gameGateway.currentGames[player.gameId].player2;
			opponentPlayer = this.gameGateway.currentGames[player.gameId].player1;
		}
		
		actualPlayer.score += 1;

		if (actualPlayer.score >= 10) {
			await this.finishGame(actualPlayer.id, opponentPlayer.id, player.gameId);
			return;
		}

		if (this.gameGateway.currentGames[player.gameId].player1.id == userId)
			this.gameGateway.currentGames[player.gameId].player1 = actualPlayer;
		else
			this.gameGateway.currentGames[player.gameId].player2 = actualPlayer;

		await this.gameGateway.server.to(String(this.gameGateway.currentGames[gameId].player1.id)).emit('scoreUpdate', this.gameGateway.currentGames[gameId]);
		await this.gameGateway.server.to(String(this.gameGateway.currentGames[gameId].player2.id)).emit('scoreUpdate', this.gameGateway.currentGames[gameId]);
	}
}
