import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create.dto';
// import { Game, Status } from '@prisma/client';
import { INQUIRER } from '@nestjs/core';
import { GameGateway } from './game.gateway';
import { GameState } from './gameState';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from '@prisma/client';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class GameService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly gameGateway: GameGateway,
		private readonly notificationService: NotificationService,
		private readonly notificationGateway: NotificationGateway,
	) {}


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
		const updatedUser = await this.prisma.user.updateMany({
			where: {
				id: {
					in: [user.id, data.userId],
				},
			},
			data: {
				status: "INGAME"
			}
		});

		const game = await this.prisma.game.create({
			data: {
				mode: 'VSONE',
				players: {
					connect: [
						{ id: data.userId },
						{ id: user.id }
					]
				}
			}
		});

		const player = await this.prisma.player.create({
			data: {
				status: 'LOSER',
				game: {
					connect: {
						id: game.id,
					},
				},
				user: {
					connect: {
						id: data.userId,
					},
				},
			},
		});
		if (!player)
			throw new HttpException(`Error creating player`, HttpStatus.BAD_REQUEST);
	
		const opponentPlayer = await this.prisma.player.create({
			data: {
				status: 'LOSER',
				game: {
					connect: {
						id: game.id,
					},
				},
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});
		if (!opponentPlayer)
			throw new HttpException(`Error creating opponent player`, HttpStatus.BAD_REQUEST);

		this.gameGateway.server.to(String(player.userId)).emit('gameStart', "start the fucking game");
		this.gameGateway.server.to(String(opponentPlayer.userId)).emit('gameStart', "start the game");

		const gameState = new GameState(
			{id: player.userId, paddlePosition: 5, score: 0},
			{id: player.userId, paddlePosition: 5, score: 0},
			{x: 0, y: 0},
			{x: 0, y: 0},
		)
		this.gameGateway.currentGames[game.id] = gameState
		this.gameGateway.server.to(String(player.userId)).emit('gameUpdate', gameState);
		this.gameGateway.server.to(String(opponentPlayer.userId)).emit('gameUpdate', gameState);
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
		// this.gameGateway.server.to(String(opponent.id)).emit('gameNotification', `rejectak ${user.profile.username}`);
		//send response to start the game
	}

	// async finishGame()

	async findGame(user: any) {
		const opponent = await this.prisma.user.findFirst({
			where: {
				id: {
					not: user.id,
				},
				status: "INQUEUE"
			}
		});
		if (!opponent) {
			console.log("no opponent found");
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
		console.log("opponent found");
		
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
			},
		});
		if (!player)
			throw new HttpException(`No player found`, HttpStatus.BAD_REQUEST);
		const opponentPlayer = await this.prisma.player.findFirst({
			where: {
				userId: opponent.id,
			},
		});
		if (!opponentPlayer)
			throw new HttpException(`No opponent player found`, HttpStatus.BAD_REQUEST);

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

		this.gameGateway.server.to(String(player.userId)).emit('queue', game);

		const gameState = new GameState(
			{id: player.userId, paddlePosition: 5, score: 0},
			{id: opponentPlayer.userId, paddlePosition: 5, score: 0},
			{x: 0, y: 0},
			{x: 0, y: 0},
		)
		this.gameGateway.currentGames[game.id] = gameState
		this.gameGateway.server.to(String(player.userId)).emit('gameUpdate', gameState);
		this.gameGateway.server.to(String(opponentPlayer.userId)).emit('gameUpdate', gameState);
	}

	
	async updatePlayerPosition(userId: number, direction: "up" | "down", gameId: number) {
		const player = await this.prisma.player.findUnique({
			where: {
				userId_gameId: {
					userId: Number(userId),
					gameId: gameId,
				},
			},
		});
		if (!player)
			throw new HttpException(`No player found`, HttpStatus.BAD_REQUEST);

		let rightPlayer = null;

		if (this.gameGateway.currentGames[player.gameId].player1.id == userId)
			rightPlayer = this.gameGateway.currentGames[player.gameId].player1;
		else
			rightPlayer = this.gameGateway.currentGames[player.gameId].player2;
		
		let currentPlayerPosition: number = await rightPlayer.paddlePosition;

		if (direction === "up")
			currentPlayerPosition -= 1;
		else if (direction === "down")
			currentPlayerPosition += 1;
		else
			throw new HttpException(`Invalid direction`, HttpStatus.BAD_REQUEST);

		rightPlayer.paddlePosition = currentPlayerPosition;

		if (this.gameGateway.currentGames[player.gameId].player1.id == userId)
			this.gameGateway.currentGames[player.gameId].player1 = rightPlayer;
		else
			this.gameGateway.currentGames[player.gameId].player2 = rightPlayer;

		await this.gameGateway.server.to(String(player.userId)).emit('paddleUpdate', currentPlayerPosition);
	}
}
