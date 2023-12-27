import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class updateProfileDto {
    @ApiProperty()
    @IsOptional({ message: 'Bio must be a string.' })
    @IsString({ message: 'Bio must be a string.' })
    @MaxLength(60, { message: 'Bio cannot exceed 50 characters.' })
    bio: string;
}