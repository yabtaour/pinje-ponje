import { IsEnum, IsNotEmpty, IsNumber, Max } from 'class-validator';
import { NotificationType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Receiver ID cannot be empty.' })
  @IsNumber({}, { message: 'Receiver ID must be a number.' })
  receiverId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Sender ID cannot be empty.' })
  @IsNumber({}, { message: 'Sender ID must be a number.' })
  @Max(2147483647, {
    message: 'ID cannot exceed the maximum value of 2147483647',
  })
  senderId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Notification type cannot be empty.' })
  @IsEnum(NotificationType, { message: 'Invalid notification type.' })
  @Max(2147483647, {
    message: 'ID cannot exceed the maximum value of 2147483647',
  })
  type: NotificationType;
}
