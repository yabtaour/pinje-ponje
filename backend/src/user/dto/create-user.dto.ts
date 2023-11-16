import { 
    IsEmail, 
    IsNotEmpty,
    IsInt,
    IsString,
    IsOptional,
    IsObject,
    ValidateNested,
    IsEmpty,
    IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateProfileDto } from '../../profiles/dto/create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDtoIntra {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty()
    intraid: number;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @ApiProperty()
    @Type(() => CreateProfileDto)
    profile: CreateProfileDto;

    @IsOptional()
    @IsBoolean()
    twofactor: boolean;

    @IsOptional()
    @IsString()
    twoFactorSecret: string;
    
}

export class CreateUserDtoLocal {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string

    @IsEmail()
    @ApiProperty()
    email: string; 

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @ApiProperty()
    @Type(() => CreateProfileDto)
    profile: CreateProfileDto;
 
    @IsOptional()
    twofactor: boolean;

    @IsOptional()
    @IsString()
    twoFactorSecret: string;
}
