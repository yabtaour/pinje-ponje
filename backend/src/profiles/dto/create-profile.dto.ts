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

export class CreateUserProfileDto {
    @IsString()
    username: string;

    @IsString()
    avatar: string;

    @IsNotEmpty()
    @IsString()
    login: string;
}