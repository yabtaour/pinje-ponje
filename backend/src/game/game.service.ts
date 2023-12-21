import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { NotificationType, Status } from '@prisma/client';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePaddlePositionDto } from './dto/game.dto';
import { GameGateway } from './game.gateway';
import { GameState } from './gameState';

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
		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				gameInvitesSent: data.userId,
			}
		});
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
		if (!opponent)
			throw new HttpException(`No user with id ${data.userId} is available`, HttpStatus.BAD_REQUEST);
		if (opponent.gameInvitesSent !== user.id)
			throw new HttpException(`No invite found`, HttpStatus.BAD_REQUEST);
		await this.prisma.user.update({
			where: {
				id: opponent.id,
			},
			data: {
				gameInvitesSent: null,
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
		await this.gameGateway.server.to(String(player.userId)).emit('gameFound', game);
		await this.gameGateway.server.to(String(opponentPlayer.userId)).emit('gameFound', game);
	}

	async declineInvite(data: {userId: number}, currentUser: any) {
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
		if (opponent.gameInvitesSent !== currentUser.id)
			throw new HttpException(`No invite found`, HttpStatus.BAD_REQUEST);
		await this.prisma.user.update({
			where: {
				id: opponent.id,
			},
			data: {
				gameInvitesSent: null,
			}
		});
		this.notificationService.create({
			senderId: currentUser.id,
			receiverId:	opponent.id,
			type: NotificationType.GAME_INVITE_REJECTED,
		})
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
			}
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
		await this.gameGateway.server.to(String(player.userId)).emit('gameFound', game);
		await this.gameGateway.server.to(String(opponentPlayer.userId)).emit('gameFound', game);
	}

	async initializeGame(client: number, payload: any) {
		console.log("ha mrra")
		const player = await this.prisma.player.findUnique({
			where: {
				userId_gameId: {
					userId: client,
					gameId: payload.gameId
				}
			},
			include: {
				game: { 
					include: {
						players: { 
							where: {
								userId: { 
									not: client 
								} 
							}, include: {
								user: true 
							} 
						} 
					} 
				} 
			},
		  });
		const opponentPlayer = player.game.players.map((otherPlayer) => otherPlayer.user);
		const gameState = new GameState(
			{id: client, paddlePosition: payload.playerPos, score: 0},
			{id: opponentPlayer[0].id, paddlePosition: payload.playerPos, score: 0},
			{x: payload.ballVel, y: payload.ballVel},
		)
		this.gameGateway.currentGames.set(payload.gameId, gameState);
		this.gameGateway.server.to(String(this.gameGateway.currentGames.get(payload.gameId).player1.id)).emit('startGame', {reversed: false});
		this.gameGateway.server.to(String(this.gameGateway.currentGames.get(payload.gameId).player2.id)).emit('startGame', {reversed: true});
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
		if (this.gameGateway.currentGames.has(payload.gameId)) {
		await this.gameGateway.server
			.to(String(this.gameGateway.currentGames.get(payload.gameId).player1.id))
			.emit('updatePaddle', {playerId: client, direction: payload.direction});
	
		await this.gameGateway.server
			.to(String(this.gameGateway.currentGames.get(payload.gameId).player2.id))
			.emit('updatePaddle', {playerId: client, direction: payload.direction});
		}
	}

	// async updateBallPosition(x: number, y: number, gameId: number) {
	// 	this.gameGateway.currentGames.get(gameId).ball.x = x;
	// 	this.gameGateway.currentGames[gameId].ball.y = y;
	// 	await this.gameGateway.server.to(String(gameId)).emit('ballUpdate', {x: x, y: y});
	// }

	async finishGame(winnerId: number, loserId: number, gameId: number) {
		if (this.gameGateway.currentGames.has(gameId)) {
		const winner = await this.prisma.player.update({
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
		const loser = await this.prisma.player.update({
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
		if (!winner || !loser)
			throw new HttpException(`Error updating players`, HttpStatus.BAD_REQUEST);
		const winnerUser = this.prisma.user.findUnique({
			where: {
				id: winnerId,
			},
		});
		const newWinnerConsitensy = (await winnerUser).consitency + winner.consitency > 100 ? 100 : (await winnerUser).consitency + winner.consitency;
		const newWinnerReflex = (await winnerUser).reflex + winner.reflex > 100 ? 100 : (await winnerUser).reflex + winner.reflex;
		const newWinnerAccuracy = (await winnerUser).accuracy + winner.accuracy > 100 ? 100 : (await winnerUser).accuracy + winner.accuracy;
		await this.prisma.user.update({
			where: {
				id: winnerId,
			},
			data: {
				status: "ONLINE",
				consitency: newWinnerConsitensy,
				reflex: newWinnerReflex,
				accuracy: newWinnerAccuracy,
			}
		});
		await this.prisma.user.update({
			where: {
				id: loserId,
			},
			data: {
				status: "ONLINE",
			}
		});
		console.log("loser : ", loserId, " winner : ", winnerId);
		await this.gameGateway.server.to(String(winnerId)).emit('gameOver', "YOU WON THE GAME !!! CONGRATULATIONS !!!");
		await this.gameGateway.server.to(String(loserId)).emit('gameOver', "YOU LOST THE GAME !!! GOOD LUCK NEXT TIME :( :( :(");		
		console.log(this.gameGateway.currentGames);
		console.log(gameId);
		this.gameGateway.currentGames.delete(gameId);
		console.log(this.gameGateway.currentGames);
		}
	}

	async updateScore(userId: number, gameId: number) {
		console.log("score update", gameId, userId);

		if (this.gameGateway.currentGames.has(gameId)) {
		if (userId === this.gameGateway.currentGames.get(gameId).player1.id) {
			this.gameGateway.currentGames.get(gameId).player2.score++ ;
			if (this.gameGateway.currentGames.get(gameId).player2.score >= 5) {
				this.finishGame(userId, this.gameGateway.currentGames.get(gameId).player2.id, gameId);
				return;
			}
			await this.gameGateway.server
				.to(String(userId))
				.emit('updateScore', {player: userId, newScore: this.gameGateway.currentGames.get(gameId).player2.score});
			await this.gameGateway.server
				.to(String(this.gameGateway.currentGames.get(gameId).player2.id))
				.emit('updateScore', {player: userId, newScore: this.gameGateway.currentGames.get(gameId).player2.score});
		} else if (userId === this.gameGateway.currentGames.get(gameId).player2.id) {
			this.gameGateway.currentGames.get(gameId).player1.score++ ;
			if (this.gameGateway.currentGames.get(gameId).player1.score >= 5) {
				this.finishGame(userId, this.gameGateway.currentGames.get(gameId).player1.id, gameId);
				return;
			}
			await this.gameGateway.server
				.to(String(this.gameGateway.currentGames.get(gameId).player1.id))
				.emit('updateScore', {player: userId, newScore: this.gameGateway.currentGames.get(gameId).player1.score});
			await this.gameGateway.server
				.to(String(userId))
				.emit('updateScore', {player: userId, newScore: this.gameGateway.currentGames.get(gameId).player1.score});
		} else {
			throw new WsException("No player found");
		}
	}
	}

	async handleClientDisconnect(client: number, gameId: number) {
		const game = this.gameGateway.currentGames.get(gameId);
		const winnerId = client == game.player1.id ? game.player2.id : game.player1.id;
		this.finishGame(winnerId, client, gameId);
	}
}