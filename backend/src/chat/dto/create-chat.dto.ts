import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateChatDmRoomDto {

    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}
