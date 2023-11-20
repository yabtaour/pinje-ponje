import{ PartialType } from '@nestjs/mapped-types';
import { CreateUserDtoLocal } from './create-user.dto';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


export class updateUserDto extends PartialType(CreateUserDtoLocal) {


    @ApiProperty()
    @Exclude()
    twoFactorSecret?: string;
}