import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
// import { CreateUserDtoLocal } from 'src/user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto, SignUpDto } from './dto/signUp.dto';
import { JWTGuard } from './guards/jwt.guard';
import { config } from 'dotenv';

config()

const VERIFICATION = process.env.VERIFICATION;
const PROFILE = process.env.PROFILE;
//talk to anas about new routes
// @ApiExcludeController()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Get('api')
    @UseGuards(AuthGuard('42'))
    async handle42Auth(@Req() request: any, @Res() response: Response) {
        const user = request.user;
		response.cookie("token", "Bearer " + request.user.token);
		if (user.user.twoFactor === true)
			response.redirect(VERIFICATION);
		else
			response.redirect(PROFILE);
	}



	
	@Get('google')
	@UseGuards(AuthGuard('google'))
	async handleGoogleAuth(
		@Req() request: any,
		@Res() response: Response
	 ) {
		const user = request.user;
		response.cookie("token", "Bearer " + request.user.token);
		if (user.user.twoFactor == true)
			response.redirect(VERIFICATION);
		else 
			response.redirect(PROFILE);
	}

	@Post('2fa')
	@UseGuards(JWTGuard)
	async handle2fa(
		@Body() body: {twofactorcode: string},
		@Req() request: Request,
		@Res() response: Response
	) {
		const user = await this.userService.getCurrentUser(request);
    	const isValid = await this.authService.userTwoFaChecker(user, body);
		if (!isValid)
			throw new HttpException("invalid verification code", HttpStatus.BAD_REQUEST);
		response.send(user);
	}

	@Post('login')
  	@UseGuards(LocalAuthGuard)
	async handleLogin(@Body() data: SignInDto, @Req() request: any, @Res() response: Response) {
		const user = request.user;
		response.cookie("token", "Bearer " + request.user.token);
		response.send(user);
	}

	@Post('signUp')
	async signUp(@Body() data: SignUpDto, @Req() request: any, @Res() response: Response) {
		const user = await this.authService.signUp(data);
		response.cookie("token", "Bearer " + user.token);
		response.send(user);
	}

	@Post('logout')
	@UseGuards(JWTGuard)
	async logout(@Req() request  : Request)	{
	const user = await this.userService.getCurrentUser(request);
	return await this.authService.logout(user);
	}

}


