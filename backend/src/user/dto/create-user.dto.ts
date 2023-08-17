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

class CreateUserProfileDto {
    @IsString()
    username: string;

    @IsString()
    avatar: string;

    @IsNotEmpty()
    @IsString()
    login: string;
}

export class CreateUserDto {
    @IsNotEmpty()
    @IsInt()
    intraid: number;

    Hashpassword: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateUserProfileDto)
    profile: CreateUserProfileDto;
}