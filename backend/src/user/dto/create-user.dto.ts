import { 
    IsEmail, 
    IsNotEmpty,
    IsInt,
    IsString
} from 'class-validator';

export class CreateUserDto {
    
    @IsNotEmpty()
    @IsInt()
    intraid: number;

    @IsNotEmpty()
    @IsString()
    login: string;

    @IsEmail()
    email: string;
}
