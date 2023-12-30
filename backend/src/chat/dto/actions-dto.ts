import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class chatActionsDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  userId: number;
}
