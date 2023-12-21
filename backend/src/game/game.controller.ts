import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import {
	ApiBearerAuth,
} from '@nestjs/swagger';
import { JWTGuard } from "src/auth/guards/jwt.guard";
import { UserService } from "src/user/user.service";
import { GameService } from "./game.service";
@UseGuards(JWTGuard)
@Controller("game")
@ApiBearerAuth()
export class GameController {
	constructor(
		private readonly gameService: GameService,
		private readonly userService: UserService
	) {}

	@Get()
	async getGames() {
		return this.gameService.getGames();
	}
	
	@Get(":id")
	async getGameById(
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.gameService.getGameById(id);
	}

	@Get('user/winrate/:id')
	async getWinrateByUserId(
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.gameService.getWinRateByUserId(id);
	}
	
	@Get('user/:id')
	async getGamesByUserId(
		@Param('id', ParseIntPipe) id: number,
	) {
		return this.gameService.getGamesByUserId(id);
	}

	@Post("queue")
	async findGame(@Req() request: Request) {
		const user = await this.userService.getCurrentUser(request);
		return this.gameService.findGame(user);
	}

	@Post("invite")
	async invitePlayer(
		@Body() data: { userId: number },
		@Req() request: Request,
	) {
		const user = await this.userService.getCurrentUser(request);
		return this.gameService.invitePlayer(data, user);
	}

	@Post("accept")
	async acceptInvite(
		@Body() data: { userId: number },
		@Req() request: Request,
	) {
		const user = await this.userService.getCurrentUser(request);
		return this.gameService.acceptInvite(data, user);
	}

	@Post("decline")
	async declineInvite(
		@Body() data: { userId: number },
		@Req() request: Request,
	) {
		const user = await this.userService.getCurrentUser(request);
		return this.gameService.declineInvite(data, user);
	}
}
