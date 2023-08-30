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

import { CreateUserProfileDto } from '../../profiles/dto/create-profile.dto';

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