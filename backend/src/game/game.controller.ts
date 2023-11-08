import { UserService } from "src/user/user.service";
import { CreateGameDto } from "./dto/create.dto";
import { GameService } from "./game.service";
import { Controller, Get, Post, Patch, Body, Req, Query, ParseIntPipe, Param, UseGuards } from "@nestjs/common";
import { JWTGuard } from "src/auth/guards/jwt.guard";

@UseGuards(JWTGuard)
@Controller("game")
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
		// const user = await this.userService.getCurrentUser(request);
		return this.gameService.invitePlayer(data);
	}

	@Post("accept")
	async acceptInvite(
		@Body() data: { userId: number },
		@Req() request: Request,
	) {
		const user = await this.userService.getCurrentUser(request);
		return this.gameService.acceptInvite(data, user);
	}

}
