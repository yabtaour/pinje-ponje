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
		console.log("trying to initialize game");
		const opponentPlayer = await this.prisma.user.findFirst({
			where: {
				id: {
					not: client,
				}
			},
			include: {
				players: {
					where: {
						gameId: payload.gameId
					}
				}
			}
		})
		const gameState = new GameState(
			{id: client, paddlePosition: payload.playerPos, score: 0},
			{id: opponentPlayer.id, paddlePosition: payload.playerPos, score: 0},
			{x: 0, y: 0},
		)
		this.gameGateway.currentGames[payload.gameId] = gameState;
		console.log("ALL GAMES !! ", this.gameGateway.currentGames);
		console.log("CURRENT GAME !! ", this.gameGateway.currentGames[payload.gameId]);
		await this.gameGateway.server.to(String(client)).emit('startGame', gameState);
		await this.gameGateway.server.to(String(opponentPlayer.id)).emit('startGame', gameState);
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

		let newY = payload.direction === "up" ? -5 : 5;
		if (client === this.gameGateway.currentGames[payload.gameId].player1.id) {
			this.gameGateway.currentGames[payload.gameId].player1.paddlePosition += newY;
			await this.gameGateway.server
				.to(String(client))
				.emit('updateFrame', this.gameGateway.currentGames[payload.gameId]);
			const temp = this.gameGateway.currentGames[payload.gameId].player1;
			this.gameGateway.currentGames[payload.gameId].player1 = this.gameGateway.currentGames[payload.gameId].player2;
			this.gameGateway.currentGames[payload.gameId].player2 = temp;
			await this.gameGateway.server
				.to(String(this.gameGateway.currentGames[payload.gameId].player1.id))
				.emit('updateFrame', this.gameGateway.currentGames[payload.gameId]);
		} else if (client === this.gameGateway.currentGames[payload.gameId].player2.id) {
			this.gameGateway.currentGames[payload.gameId].player2.paddlePosition += newY;
			await this.gameGateway.server
				.to(String(this.gameGateway.currentGames[payload.gameId].player1.id))
				.emit('updateFrame', this.gameGateway.currentGames[payload.gameId]);
			const temp = this.gameGateway.currentGames[payload.gameId].player1;
			this.gameGateway.currentGames[payload.gameId].player1 = this.gameGateway.currentGames[payload.gameId].player2;
			this.gameGateway.currentGames[payload.gameId].player2 = temp;
			await this.gameGateway.server
				.to(String(client))
				.emit('updateFrame', this.gameGateway.currentGames[payload.gameId]);
		} else {
			throw new WsException("No player found");
		}
	}

	async updateBallPosition(x: number, y: number, gameId: number) {
		this.gameGateway.currentGames[gameId].ball.x = x;
		this.gameGateway.currentGames[gameId].ball.y = y;
		await this.gameGateway.server.to(String(gameId)).emit('ballUpdate', {x: x, y: y});
	}

	// async gameOver(gameId: number) {
	// 	this.gameGateway.currentGames.delete(gameId);
	// 	await this.gameGateway.server.to(String(gameId)).emit('gameOver');
	// }


	async finishGame(winnerId: number, loserId: number, gameId: number) {
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
		// const loserUser = this.prisma.user.findUnique({
		// 	where: {
		// 		id: loserId,
		// 	},
		// });
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
		await this.gameGateway.server.to(String(winnerId)).emit('gameOver', "YOU WON THE GAME !!! CONGRATULATIONS !!!");
		await this.gameGateway.server.to(String(loserId)).emit('gameOver', "YOU LOST THE GAME !!! GOOD LUCK NEXT TIME :( :( :(");		
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

		let actualPlayer = null;
		let opponentPlayer = null;

		if (this.gameGateway.currentGames[player.gameId].player1.id == userId) {
			actualPlayer = this.gameGateway.currentGames[player.gameId].player1;
			opponentPlayer = this.gameGateway.currentGames[player.gameId].player2;
		}
		else if (this.gameGateway.currentGames[player.gameId].player2.id == userId) {
			actualPlayer = this.gameGateway.currentGames[player.gameId].player2;
			opponentPlayer = this.gameGateway.currentGames[player.gameId].player1;
		}
		else
			throw new WsException("Player Not found");
		
		actualPlayer.score += 1;

		if (actualPlayer.score == 10) {
			await this.prisma.player.update({
				where: {
					userId_gameId: {
						userId: Number(actualPlayer.id),
						gameId: gameId,
					},
				},
				data: {
					score: actualPlayer.score,
				},
			});
			await this.prisma.player.update({
				where: {
					userId_gameId: {
						userId: Number(opponentPlayer.id),
						gameId: gameId,
					},
				},
				data: {
					score: opponentPlayer.score,
				},
			});
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
