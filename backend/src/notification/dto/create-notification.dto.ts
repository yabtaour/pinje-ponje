import { IsNotEmpty, IsNumber } from "class-validator";
import { NotificationType } from "@prisma/client";


export class CreateNotificationDto {
	@IsNotEmpty()
	@IsNumber()
	receiverId: number;

	@IsNotEmpty()
	@IsNumber()
	senderId: number;

	@IsNotEmpty()
	@IsNumber()
	type: NotificationType;
}
