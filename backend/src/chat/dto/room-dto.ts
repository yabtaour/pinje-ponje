import { MessageState } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RoomDto {
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  name: string;

  @IsString({ message: 'Password must be a string.' })
  @IsOptional({ message: 'Password is optional.' })
  password?: string;
}

export class joinRoomDto {
  @IsOptional()
  @IsNumber({}, { message: 'Room ID must be a number.' })
  @Transform(({ value }) => parseInt(value))
  roomId?: number;

  @IsOptional({ message: 'Password is optional.' })
  password?: string;
}

export class MessageDto {
  @IsOptional()
  @IsNumber({}, { message: 'ID must be a number.' })
  @Transform(({ value }) => parseInt(value))
  id?: number;

  @IsNotEmpty({ message: 'Message cannot be empty.' })
  message: string;

  @IsOptional()
  state?: MessageState;
}