import { Transform } from "class-transformer";
import { IsOptional, IsInt, IsNumber } from "class-validator";

export class PaginationLimitDto {
    @IsOptional()
    @IsInt({ message: 'Skip must be an integer.' })
    @Transform(({ value }) => parseInt(value))
    skip?: number;
  
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Take must be a valid number.' })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    take?: number;
  }