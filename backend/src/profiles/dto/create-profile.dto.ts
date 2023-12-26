import { 
    IsEmail, 
    IsNotEmpty,
    IsInt,
    IsString,
    IsOptional,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
    @IsString({ message: 'Username must be a string.' })
    @ApiProperty()
    username: string;

    @IsString({ message: 'Avatar must be a string.' })
    @ApiProperty()
    avatar: string;

    @IsNotEmpty({ message: 'Login cannot be empty.' })
    @IsString({ message: 'Login must be a string.' })
    @ApiProperty()
    login: string;
}
