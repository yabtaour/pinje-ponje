import { IsNotEmpty, IsNumber } from "class-validator";

export class blockAndUnblockUserDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;
}