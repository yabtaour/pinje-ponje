import{ PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { IsOptional, IsString } from 'class-validator';

export class updateProfileDto {
    @IsOptional()
    @IsString()
    bio: string
}