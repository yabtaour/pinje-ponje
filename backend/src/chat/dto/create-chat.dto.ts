import { Transform } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateChatDmRoomDto {

    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    peer_id?: number;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    role: string;
}
