import{ PartialType } from '@nestjs/mapped-types';
import { CreateUserDtoLocal } from './create-user.dto';

export class updateUserDto extends PartialType(CreateUserDtoLocal) {

}