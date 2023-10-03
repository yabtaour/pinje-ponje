import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateChatDmRoomDto {

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsNotEmpty()
    @IsString()
    roomType: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}
