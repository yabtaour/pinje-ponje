import{ PartialType } from '@nestjs/mapped-types';
import { CreateUserDtoLocal } from './create-user.dto';
import { Exclude } from 'class-transformer';

export class updateUserDto extends PartialType(CreateUserDtoLocal) {
    @Exclude()
    twoFactorSecret?: string;
}