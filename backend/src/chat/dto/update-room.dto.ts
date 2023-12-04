import { RoomType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class updateRoomDto {

    @IsNumber()
    @IsNotEmpty()
    roomId: number

    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsEnum(RoomType)
    roomType: RoomType;
}
