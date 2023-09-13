import{ PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class updateUserDto extends PartialType(CreateUserDto) {
    // twofactor: boolean;
    // profile: upda
    
}