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

export class CreateUserProfileDto {
    @IsString()
    @ApiProperty()
    username: string;

    @IsString()
    @ApiProperty()
    avatar: string;
    email?: string;
    Hashpassword?: string;
    twofactor?: boolean;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    login: string;
}