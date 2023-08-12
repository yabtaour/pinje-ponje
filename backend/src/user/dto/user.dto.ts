import { 
    IsEmail, 
    IsNotEmpty,
    IsInt,
    IsString,
    IsOptional,
    IsIn
} from 'class-validator';

export class UserDto {
    
    @IsInt()
    sub : number;

    @IsNotEmpty()
    @IsInt()
    intraid: number;

    @IsNotEmpty()
    @IsString()
    login: string;

    @IsEmail()
    email: string;
}
