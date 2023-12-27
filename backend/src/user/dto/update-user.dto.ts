import { Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class updateUserDto {
  @ApiProperty()
  @IsOptional({ message: 'Username must be a string.' })
  @IsString({ message: 'Username must be a string.' })
  @MaxLength(25, { message: 'username cannot exceed 25 characters.' })
  username: string;

  @ApiProperty()
  @IsOptional({ message: 'Email must be a valid email address.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty()
  @IsOptional({ message: 'TwoFactor must be a boolean value.' })
  @IsBoolean({ message: 'TwoFactor must be a boolean value.' })
  twoFactor: boolean;

  @ApiProperty()
  @IsOptional()
  status : Status
}

export class resretPasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Old value cannot be empty.' })
  @IsString({ message: 'Old value must be a string.' })
  old: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'New value cannot be empty.' })
  @IsString({ message: 'New value must be a string.' })
  new: string;
}
