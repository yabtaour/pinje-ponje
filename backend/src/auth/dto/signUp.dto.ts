import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignUpDto {
	@IsNotEmpty({ message: 'Username is required'})
	@IsString()
	username: string;

	@IsNotEmpty({ message: "email is required"})
	email: string;

	@IsNotEmpty({ message: "password is required"})
	@IsString()
	password: string;

	@IsOptional()
	@IsString()
	avatar: string;
}

export class SignInDto {

	@IsNotEmpty({ message: "email is required"})
	email: string;

	@IsNotEmpty({ message: "password is required"})
	@IsString()
	password: string;
}
