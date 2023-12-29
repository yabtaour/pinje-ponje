import { GameMode } from '@prisma/client';
import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty({ message: 'Game mode cannot be empty.' })
  @IsString({ message: 'Game mode must be a string.' })
  mode: GameMode;

  @IsNotEmpty({ message: 'Players array cannot be empty.' })
  // @IsArray({ message: 'Players must be an array.' })
  // @ArrayMinSize(1, { message: 'At least one player must be specified.' })
  players: number[];
}
