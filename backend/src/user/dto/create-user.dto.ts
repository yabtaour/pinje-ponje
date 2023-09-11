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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    intraid: number;

    Hashpassword: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @ApiProperty()
    @Type(() => CreateUserProfileDto)
    profile: CreateUserProfileDto;
}