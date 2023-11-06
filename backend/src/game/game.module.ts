import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import {UserModule} from "../user/user.module";

@Module({
	controllers: [GameController],
	imports: [UserModule],
	providers: [GameService],
})
export class GameModule {}
