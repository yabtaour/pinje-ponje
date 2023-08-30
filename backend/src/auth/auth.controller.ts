import { Controller, Get, Post, UseGuards, Res, Req, Redirect, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request, response } from 'express';
import { get, request } from 'http';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
    constructor(
        // private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Get('42/200/:id')
    async getProfile(@Param() id) {
        const profile = this.userService.FindUserByID(Number(id.id));
        return profile;
    }

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async redirectTo42Auth() {
			console.log("redirected");
		}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async handle42Auth(@Req() request: any, @Res() response: Response) {
        const user = request.user;
        console.log("Copy This Token: ", request.user.token);
        response.setHeader("Authorisation", request.user.token);
        response.redirect(`200/${String(request.user.user.id)}`);
    }

		@Post('login')
		@UseGuards(LocalAuthGuard)
		async handleLogin(@Req() request: any, @Res() response: Response) {
			// console.log(request);
			console.log("we got in the controller");
			console.log("user loged in needs redirection to profile");
		}
}

@Controller('signUp')
export class SignUpController {
		constructor(
				private readonly userService: UserService
		) {}

		@Post()
		async signUp(@Req() request: any, @Res() response: Response) {
			try {
				console.log(request.body);
				const user = {
					intraid: 4444,
					Hashpassword: request.body.Hashpassword,
					email: request.body.email,
					profile: {
						username: request.body.username,
						avatar: request.body.avatar,
						login: request.body.username,
					},
				};
				const userCreated = await this.userService.CreateUser(user);
				console.log(user);
			} catch(error) {
				// console.log(error);
				return "Error: User Already Exist";
			}
		}
}