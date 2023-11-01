import { IsNotEmpty, IsString } from "class-validator";

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    mode: string;

    @IsNotEmpty()
    players: any[];
}

export class ScoreCreateDto {
    
}