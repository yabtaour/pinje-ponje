import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateScoreDto {

  @ApiProperty()
  @IsNotEmpty({ message: 'User ID cannot be empty.' })
  @IsNumber({}, { message: 'User ID must be a number.' })
  userId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Game ID cannot be empty.' })
  @IsNumber({}, { message: 'Game ID must be a number.' })
  gameId: number;
}

export class UpdatePaddlePositionDto {

  @ApiProperty()
  @IsNotEmpty({ message: 'Game ID cannot be empty.' })
  @IsNumber({}, { message: 'Game ID must be a number.' })
  gameId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Direction cannot be empty.' })
  direction: "up" | "down";
}

export class UpdateBallPositionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Game ID cannot be empty.' })
  @IsNumber({}, { message: 'Game ID must be a number.' })
  gameId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'X coordinate cannot be empty.' })
  @IsNumber({}, { message: 'X coordinate must be a number.' })
  x: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Y coordinate cannot be empty.' })
  @IsNumber({}, { message: 'Y coordinate must be a number.' })
  y: number;
}

export class GameActionDto {

  @ApiProperty()
  @IsNotEmpty({ message: 'userId cannot be empty.' })
  @IsNumber({}, { message: 'userId must be a number.' })
  userId: number
}