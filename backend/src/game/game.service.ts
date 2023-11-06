import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create.dto';
import { Status } from '@prisma/client';
import { INQUIRER } from '@nestjs/core';

@Injectable()
export class GameService {
	constructor(
		private readonly prisma: PrismaService,
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

	async getGame(id: number) {
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
	
		// send notification to opponent
	}

	async acceptInvite(data: {userId: number}, user: any) {
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
		
		const game = await this.prisma.game.create({
			data: {
				mode: 'VSONE',
				players: {
					connect: [
						{ id: data.userId },
						{ id: opponent.id }
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
						id: opponent.id,
					},
				},
			},
		});
		if (!opponentPlayer)
			throw new HttpException(`Error creating opponent player`, HttpStatus.BAD_REQUEST);

		//send response to start the game
		return game;
	}

	async findGame(user: any) {
		const opponent = await this.prisma.user.findFirst({
			where: {
				id: {
					not: user.id,
				},
				status: "INQUEUE"
			}
		});
		if (!opponent)
			throw new HttpException(`No opponent found`, HttpStatus.BAD_REQUEST);
	
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

		//send response to start the game
	}
}
