
import{ PartialType } from '@nestjs/mapped-types';
import { CreateUserDtoLocal } from './create-user.dto';
import { Exclude } from 'class-transformer';
import { Status } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class updateUserDto extends PartialType(CreateUserDtoLocal) {
    @Exclude()
    twoFactorSecret?: string;

    @IsOptional()
    status: Status;
}