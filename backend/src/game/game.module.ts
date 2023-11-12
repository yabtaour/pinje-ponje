import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import {UserModule} from "../user/user.module";
import { GameGateway } from './game.gateway';
import { AuthModule } from "src/auth/auth.module";

@Module({
	controllers: [GameController],
	imports: [UserModule, AuthModule],
	providers: [GameService, GameGateway],
	exports: [GameService, GameGateway],
})
export class GameModule {}
