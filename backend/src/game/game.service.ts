import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
	constructor(private readonly prisma: PrismaService) {}

	async createGame(data: any) {
		console.log(data);
		const game = this.prisma.game.create({
			data: {
				...data,
				players:{
					connect: data.players.map((player) => ({ id: player })),
				}
			},
		});
		if (!game)
			throw new HttpException('Game not created', HttpStatus.NOT_FOUND);
		return game;
	}

	async getAllGames() {
		const games = this.prisma.game.findMany();
		if (!games)
			throw new HttpException('No games found', HttpStatus.NOT_FOUND);
		return games;
	}

	async getGameById(id: number) {
		const game = this.prisma.game.findUnique({
			where: {
				id: id,
			},
		});
		if (!game)
			throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
		return game;
	}

	async updateGame(id: number, data) {
		const findGame = this.prisma.game.findUnique({
			where: {
				id: id,
			},
		});
		if (!findGame)
			throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
		const game = this.prisma.game.update({
			where: {
				id: id,
			},
			data: {
				...data,
			},
		});
	}

	async deleteGame(id: number) {
		const findGame = this.prisma.game.findUnique({
			where: {
				id: id,
			},
		});
		if (!findGame)
			throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
		const game = this.prisma.game.delete({
			where: {
				id: id,
			},
		});
	}

	async createScore(data: any) {
		const score = this.prisma.score.create({
			data: {
				...data,
			},
		});
		if (!score)
			throw new HttpException('Score not created', HttpStatus.NOT_FOUND);
		return score;
	}

	async getAllScores() {
		const scores = this.prisma.score.findMany();
		if (!scores)
			throw new HttpException('No scores found', HttpStatus.NOT_FOUND);
		return scores;
	}

	async getScoreById(id: number) {
		const score = this.prisma.score.findUnique({
			where: {
				id: id,
			},
		});
		if (!score)
			throw new HttpException('Score not found', HttpStatus.NOT_FOUND);
		return score;
	}

	async getScoresByUserId(id: number) {
		const scores = this.prisma.score.findMany({
			where: {
				playerid: id,
			},
		});
		if (!scores)
			throw new HttpException('No scores found', HttpStatus.NOT_FOUND);
		return scores;
	}

	async updateScore(id: number, data) {
		const findScore = this.prisma.score.findUnique({
			where: {
				id: id,
			},
		});
		if (!findScore)
			throw new HttpException('Score not found', HttpStatus.NOT_FOUND);
		const score = this.prisma.score.update({
			where: {
				id: id,
			},
			data: {
				...data,
			},
		});
		return score;
	}

	async deleteScore(id: number) {
		const findScore = this.prisma.score.findUnique({
			where: {
				id: id,
			},
		});
		if (!findScore)
			throw new HttpException('Score not found', HttpStatus.NOT_FOUND);
		const score = this.prisma.score.delete({
			where: {
				id: id,
			},
		});
		return score;
	}

}
