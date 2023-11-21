import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';


export class updateUserDto {

    @IsOptional()
    @IsBoolean()
    twoFactor

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;
}