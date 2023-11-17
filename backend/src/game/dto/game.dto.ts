import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateScoreDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  gameId: number;
}

export class UpdatePaddlePositionDto {
  @IsNotEmpty()
  @IsNumber()
  gameId: number;

  @IsNotEmpty()
  @IsString()
  direction: "up" | "down";
}

export class UpdateBallPositionDto {
  @IsNotEmpty()
  @IsNumber()
  gameId: number;

  @IsNotEmpty()
  @IsNumber()
  x: number;

  @IsNotEmpty()
  @IsNumber()
  y: number;
}
