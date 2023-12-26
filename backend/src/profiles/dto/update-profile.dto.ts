import { IsOptional, IsString } from 'class-validator';

export class updateProfileDto {
    @IsOptional({ message: 'Bio must be a string.' })
    @IsString({ message: 'Bio must be a string.' })
    bio: string;
}