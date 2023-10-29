import { GameService } from "./game.service";
import { Controller, Get, Post, Patch } from "@nestjs/common";

@Controller("game")
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get()
	getGame() {
		return this.gameService.getGame();
	}

	@Post()
	createGame() {
		return this.gameService.createGame();
	}

	@Patch()
	updateGame() {
		return this.gameService.updateGame();
	}
}
