import { Transform } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateChatDmRoomDto {

    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;

    @IsString({ message: 'Password should be a string' })
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Peer ID should be a number' })
    @Transform(({ value }) => parseInt(value))
    peer_id?: number;

    @IsNotEmpty({ message: 'Type should not be empty' })
    @IsString({ message: 'Type should be a string' })
    type: string;

    @IsOptional()
    @IsString({ message: 'Role should be a string' })
    role: string;
}

