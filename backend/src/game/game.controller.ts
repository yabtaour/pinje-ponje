import { CreateGameDto } from "./dto/create.dto";
import { GameService } from "./game.service";
import { Controller, Get, Post, Patch, Body } from "@nestjs/common";

@Controller("game")
export class GameController {
	constructor(private readonly gameService: GameService) {}

	// @Get()
	// getGame() {
	// 	return this.gameService.getGame();
	// }

	@Post()
	async createGame(@Body() data: CreateGameDto) {
		return this.gameService.createGame(data);
	}

	@Post("queue")
	async findGame(@Body() data: any) {
		return this.gameService.findGame(data);
	}

	// @Patch()
	// updateGame() {
	// 	return this.gameService.updateGame();
	// }
}
