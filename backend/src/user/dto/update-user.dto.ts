import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class updateUserDto {

    @IsOptional({ message: 'Username must be a string.' })
    @IsString({ message: 'Username must be a string.' })
    username: string;

    @IsOptional({ message: 'Email must be a valid email address.' })
    @IsEmail({}, { message: 'Email must be a valid email address.' })
    email: string;

    @IsOptional({ message: 'TwoFactor must be a boolean value.' })
    @IsBoolean({ message: 'TwoFactor must be a boolean value.' })
    twoFactor: boolean;
}
