import {
  IsEmail,
  IsNotEmpty,
  IsInt,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDtoIntra {
  @IsNotEmpty({ message: 'Intraid cannot be empty.' })
  @IsInt({ message: 'Intraid must be an integer.' })
  @ApiProperty()
  intraid: number;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Username cannot be empty.' })
  @IsString({ message: 'Username must be a string.' })
  @MaxLength(25, { message: 'username cannot exceed 25 characters.' })
  @ApiProperty()
  username: string;
}

export class CreateUserDtoLocal {
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @IsString({ message: 'Password must be a string.' })
  @ApiProperty()
  password: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Username cannot be empty.' })
  @IsString({ message: 'Username must be a string.' })
  @MaxLength(25, { message: 'username cannot exceed 25 characters.' })
  @ApiProperty()
  username: string;
}
