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
import { JwtAuthService } from './jwt.service';


//talk to anas about new routes
// @ApiExcludeController()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
				// private readonly jwtAuthService: JwtAuthService,
        private readonly authService: AuthService
    ) {}

    @Get('api')
    @UseGuards(AuthGuard('42'))
    async handle42Auth(@Req() request: any, @Res() response: Response) {
        const user = request.user;
        console.log("Copy This Token: ", request.user.token);
				response.cookie("token", request.user.token, {httpOnly: true});
				response.send(user);
    }

	@Post('login')
  @UseGuards(LocalAuthGuard)
	async handleLogin(@Body() data: SignInDto, @Req() request: any, @Res() response: Response) {
		const user = request.user;
  	console.log("Copy This Token: ", request.user.token);
		response.cookie("token", request.user.token, {httpOnly: true});
		response.send(user);
	}

    @Post('2fa')
    @UseGuards(JWTGuard)
    async handle2fa(@Body() body: {twofactorcode: string}, @Req() request: any) {
        const user = await this.userService.FindUserByID(Number(request.user.sub));
				if (!user)
					throw new HttpException("user not found", HttpStatus.NOT_FOUND);
        const isValid = await this.authService.userTwoFaChecker(user, body);
				if (!isValid)
					throw new HttpException("invalid code", HttpStatus.BAD_REQUEST);
    }

		@Post('signUp')
		async signUp(@Body() data: SignUpDto, @Req() request: any, @Res() response: Response) {
			const user = await this.authService.signUp(data);
			response.cookie("token", user.token, {httpOnly: true});
			response.send(user);
	}
}
