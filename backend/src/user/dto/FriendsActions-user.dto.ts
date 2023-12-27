import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class FriendsActionsDto {
	@ApiProperty()
	@IsNotEmpty({ message: 'ID cannot be empty' })
	@IsNumber({}, { message: 'ID must be a number' })
	@Min(0, { message: 'ID must be at least 1.' })
	@Max(2147483647, { message: 'ID cannot exceed the maximum value of 2147483647' })
	id: number;
  }
  