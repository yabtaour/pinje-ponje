import {
  IsEmail,
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
} from 'class-validator';

export class UserDto {
  @IsInt({ message: 'Sub must be an integer.' })
  sub: number;

  @IsNotEmpty({ message: 'Intraid cannot be empty.' })
  @IsInt({ message: 'Intraid must be an integer.' })
  intraid: number;

  @IsNotEmpty({ message: 'Login cannot be empty.' })
  @IsString({ message: 'Login must be a string.' })
  login: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Hashpassword must be a string.' })
  Hashpassword: string;

  @IsOptional()
  @IsString({ message: 'Twofactorsecret must be a string.' })
  twofactorsecret: string;
}
