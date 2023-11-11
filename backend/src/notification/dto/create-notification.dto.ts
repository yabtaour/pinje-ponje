import { IsNotEmpty, IsNumber } from "class-validator";
import { NotificationType } from "@prisma/client";


export class CreateNotificationDto {
	@IsNotEmpty()
	@IsNumber()
	receiverid: number;

	@IsNotEmpty()
	@IsNumber()
	senderid: number;

	@IsNotEmpty()
	@IsNumber()
	type: NotificationType;
}
