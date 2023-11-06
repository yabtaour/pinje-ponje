import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import {UserModule} from "../user/user.module";
import { GameGateway } from './game.gateway';

@Module({
	controllers: [GameController],
	imports: [UserModule],
	providers: [GameService, GameGateway],
})
export class GameModule {}
