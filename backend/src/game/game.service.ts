import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create.dto';
// import { Game, Status } from '@prisma/client';
import { INQUIRER } from '@nestjs/core';
import { GameGateway } from './game.gateway';

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
		// const opponent = await this.prisma.user.findFirst({
		// 	where: {
		// 		id: data.userId,
		// 		status: {
		// 		 in: ["ONLINE", "INQUEUE"]
		// 	 	}
		// 	}
		// });
		// if (!opponent)
		// 	throw new HttpException(`No user with id ${data.userId} is available`, HttpStatus.BAD_REQUEST);
		
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
		// console.log(this.gameGateway.server.sockets);
		// console.log(this.gameGateway.server.sockets.sockets);
		// console.log(this.gameGateway.server.co
		// console.log(this.gameGateway.server.sockets[String(opponentPlayer.userId)]);
		// console.log(this.gameGateway.server.sockets.sockets[String(player.userId)]);
		// console.log(this.gameGateway.server.sockets.sockets[user.id]);
		// this.gameGateway.server.sockets.sockets[user.id].emit('queue', game);
		// const sockets = this.gameGateway.server.sockets._ids;
		// this.gameGateway.server.sockets.sockets[player.userId].emit('queue', game);
		// this.gameGateway.server.sockets.sockets[opponentPlayer.userId].emit('queue', game);
		// console.log(sockets);
		// const socket = this.gameGateway.server.sockets;
		// const clients = socket.
		// const client = this.gameGateway.server.sockets.
		// if (!client)
		// 	throw new HttpException(`Error finding client`, HttpStatus.BAD_REQUEST);
		// console.log(client)
		// client.emit('queue', game);
		//send response to start the game
	}
}
