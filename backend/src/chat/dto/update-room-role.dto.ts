import { ChatRole } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class updateRoomRoleDto {

    @IsOptional() // optional just in case we used socket
    @IsString({ message: 'roomId should be a number' })
    roomId?: string;

    @IsNumber({}, { message: 'userId should be a number and not empty' })
    @Transform(({ value }) => parseInt(value))
    userId?: number;

    @IsString({ message: 'Role should be a string' })
    role: ChatRole;
}

