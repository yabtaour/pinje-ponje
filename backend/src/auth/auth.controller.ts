import { Controller, Get, Post, UseGuards, Res, Req, Redirect, Param, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request, response } from 'express';
import { get, request } from 'http';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './guards/local.guard';
import { CreateUserDtoLocal } from 'src/user/dto/create-user.dto';


//talk to anas about new routes
@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('42/200/:id')
    async getProfile(@Param() id) {
        const profile = this.userService.FindUserByID(Number(id.id));
        return profile;
    }

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async redirectTo42Auth() {}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async handle42Auth(@Req() request: any, @Res() response: Response) {
        const user = request.user;
        console.log("Copy This Token: ", request.user.token);
        response.redirect(`200/${String(request.user.user.id)}`);
    }

	@Post('login')
	@UseGuards(LocalAuthGuard)
	async handleLogin(@Req() request: any, @Res() response: Response) {
		const user = request.user;
		response.setHeader("Authorisation", request.user.token);
		response.redirect(`200/${String(request.user.user.id)}`);
	}
}

@Controller('signUp')
export class SignUpController {
		constructor(
				private readonly userService: UserService,
				private readonly authService: AuthService
		) {}

		@Post()
		async signUp(@Body() request: CreateUserDtoLocal, @Res() response: Response) {
			// return this.authService.signUp(request);
			const user = this.authService.signUp(request);
			response.redirect('http://localhost:3000/auth/login');
		}
}