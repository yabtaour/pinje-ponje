import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RoomDto {

    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    password?: string;

}
