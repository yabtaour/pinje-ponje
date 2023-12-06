import { RoomType } from "@prisma/client";
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,  } from "class-validator";

export class updateRoomDto {

    @IsNumber()
    @IsOptional()
    roomId?: number
    
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsOptional()
    password?: string;
    
    @IsOptional()
    @IsDefined()
    @IsEnum(RoomType, { message: 'Invalid room type' })
    roomType?: RoomType;
}
