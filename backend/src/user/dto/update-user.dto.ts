
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class updateUserDto {

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsBoolean()
    twoFactor: boolean;
}