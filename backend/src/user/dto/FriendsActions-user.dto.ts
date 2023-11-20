import { IsNotEmpty, IsNumber } from "class-validator";

export class FriendsActionsDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;
}