import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create.dto';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class GameService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly queueService: QueueService
	) {}

	async createGame(data: CreateGameDto) {
		const { mode, players } = data;
		let playersObjects = [];
		if (players.length != 4 && players.length != 2) {
			throw new HttpException(
				'Number of players must be 2 or 4',
				HttpStatus.BAD_REQUEST,
			);
		}
		players.forEach(async (id) => {

			const user = await this.prisma.user.findUnique({ where: { id: id } });
			if (!user) {
				throw new HttpException(
					`User with id ${id} does not exist`,
					HttpStatus.BAD_REQUEST,
				);
			}
			playersObjects.push(user);
		});

		const game = await this.prisma.game.create({
			data: {
				mode: mode,
				players: {
					connect: playersObjects.map((id) => ({ id })),
				},
			},
		});

		players.forEach(async (id) => {
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
							id: id,
						},
					},
				},
			});
		});
		return game;
	}

	async findGame(data: any) {
		const {Rank, wr} = data;

		const user = await this.prisma.user.findUnique({where: {id: data.id}});
		if (!user)
			throw new HttpException("User not found", HttpStatus.BAD_REQUEST);

		const opponent = await this.queueService.getopponent(Rank, wr);
		if (!opponent)
			throw new HttpException("No opponent found", HttpStatus.BAD_REQUEST);
		
	}
}
