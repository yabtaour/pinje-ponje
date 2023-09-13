import{ PartialType } from '@nestjs/mapped-types';
import { CreateUserProfileDto } from './create-profile.dto';

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {

}