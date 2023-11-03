import { GameMode } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    mode: GameMode;

    @IsNotEmpty()
    players: number[];
}
