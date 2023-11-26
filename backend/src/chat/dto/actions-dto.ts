import { Transform } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class chatActionsDto {

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    id: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    userId: number;

}