import{ PartialType } from '@nestjs/mapped-types';
import { CreateUserDtoLocal } from './create-user.dto';
import { Exclude } from 'class-transformer';
import { Status } from '@prisma/client';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class updateUserDto {

    @IsOptional()
    @IsBoolean()
    twoFactor

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;
}