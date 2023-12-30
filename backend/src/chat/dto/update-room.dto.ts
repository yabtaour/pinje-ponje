import { RoomType } from '@prisma/client';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class updateRoomDto {
  @IsNumber({}, { message: 'Room ID must be a number.' })
  @IsOptional({ message: 'Room ID is optional.' })
  roomId?: number;

  @IsString({ message: 'Name must be a string.' })
  @IsOptional({ message: 'Name is optional.' })
  name?: string;

  @IsString({ message: 'Password must be a string.' })
  @IsOptional({ message: 'Password is optional.' })
  password?: string;

  @IsDefined({ message: 'Room type must be defined.' })
  @IsOptional({ message: 'Room type is optional.' })
  @IsEnum(RoomType, { message: 'Invalid room type.' })
  roomType?: RoomType;
}
