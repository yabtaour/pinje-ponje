import { 
    IsEmail, 
    IsNotEmpty,
    IsInt,
    IsString,
    IsOptional,
    IsObject,
    ValidateNested,
    IsEmpty,
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

    // @IsOptional()
    // twofactor: boolean;
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @ApiProperty()
    @Type(() => CreateProfileDto)
    profile: CreateProfileDto;
}

export class CreateUserDtoLocal {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    Hashpassword: string

    @IsEmail()
    @ApiProperty()
    email: string; 

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @ApiProperty()
    @Type(() => CreateProfileDto)
    profile: CreateProfileDto;
}
