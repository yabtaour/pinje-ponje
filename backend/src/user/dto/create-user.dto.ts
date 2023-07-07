import { IsEmail } from 'class-validator';

export class CreateUserDto {
    
    
    login: string;
    @IsEmail()
    email: string;
}
