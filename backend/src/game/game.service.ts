import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create.dto';
// import { Game, Status } from '@prisma/client';
import { INQUIRER } from '@nestjs/core';
import { GameGateway } from './game.gateway';
import { GameState } from './gameState';

@Injectable()
export class GameService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly gameGateway: GameGateway,
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
	
		this.gameGateway.server.to(String(opponent.id)).emit('gamenotification', `you have a game invitation from ${user.profile.username}`);
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

		//send response to start the game
		// return game;
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
		

		this.gameGateway.server.to(String(opponent.id)).emit('gameNotification', `rejectak ${user.profile.username}`);
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
		console.log("opponent found");
	
		const game = await this.prisma.game.create({
			data: {
				mode: 'VSONE',
				players: {
					connect: [
						{ id: user.id },
						{ id: opponent.id }
					]
				}
			}
		});
		if (!game)
			throw new HttpException(`Error creating game`, HttpStatus.BAD_REQUEST);

		console.log("game created");

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
						id: user.id,
					},
				},
			},
		});
		if (!player)
			throw new HttpException(`Error creating player 1`, HttpStatus.BAD_REQUEST);

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
						id: opponent.id,
					},
				},
			},
		});
		if (!opponentPlayer)
			throw new HttpException(`Error creating player 2`, HttpStatus.BAD_REQUEST);


		this.gameGateway.server.to(String(player.userId)).emit('queue', game);

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


	async updatePlayerPosition(userId: number, position: number, move: {x: number, y: number}) {
		const player = await this.prisma.player.findFirst({
			where: {
				userId: userId,
			},
		});
		if (!player)
			throw new HttpException(`No player found`, HttpStatus.BAD_REQUEST);
		let currentPlayerPosition = this.gameGateway.currentGames[player.gameId].player1.paddlePosition;
		currentPlayerPosition.x += move.x;
		currentPlayerPosition.y += move.y;

		this.gameGateway.currentGames[player.gameId].player1.paddlePosition = currentPlayerPosition;
		this.gameGateway.server.to(String(player.userId)).emit('paddleUpdate', currentPlayerPosition);
	}

}
