import { Controller, Get, Post, UseGuards, Res, Req, Redirect, Param, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request, response } from 'express';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './guards/local.guard';
// import { CreateUserDtoLocal } from 'src/user/dto/create-user.dto';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ApiExcludeController } from '@nestjs/swagger/dist/decorators/api-exclude-controller.decorator';
import { JWTGuard } from './guards/jwt.guard';


//talk to anas about new routes
// @ApiExcludeController()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Get('/200/:id')
    async getProfile(@Param() id) {
        const profile = this.userService.FindUserByID(Number(id.id));
        return profile;
    }

    // @Get('42')
    // @UseGuards(AuthGuard('42'))
    // async redirectTo42Auth() {}

    @Get('api')
    @UseGuards(AuthGuard('42'))
    async handle42Auth(@Req() request: any, @Res() response: Response) {
        const user = request.user;
        console.log("Copy This Token: ", request.user.token);
        response.redirect(`200/${String(request.user.user.id)}`);
    }

	@Post('login')
    @UseGuards(LocalAuthGuard)
	async handleLogin(@Body() body: {email, Hashpassword}, @Req() request: any, @Res() response: Response) {
		const user = request.user;
        console.log("Copy This Token: ", request.user.token);
		response.setHeader("authorization", request.user.token);
		response.redirect(`200/${String(request.user.user.id)}`);
	}

    @Post('2fa')
    @UseGuards(JWTGuard)
    async handle2fa(@Body() body: {twofactorcode: string}, @Req() request: any, @Res() response: Response) {
        // console.log("body: ", body);
        // console.log("user", request.user);
        // console.log("user", request.user.user);
        const user = await this.userService.FindUserByID(Number(request.user.sub));
        console.log("user: ", user);
        const isValid = this.authService.userTwoFaChecker(user, body.twofactorcode);
        if (isValid) {
            response.setHeader("authorization", request.user.token);
            response.redirect(`200/${String(request.user.user.id)}`);
        } else {
            response.redirect(`http://localhost:3000/auth/login`);
        }
        console.log("Copy This Token: ", request.user.token);
        response.setHeader("authorization", request.user.token);
        response.redirect(`200/${String(request.user.user.id)}`);
    }
}

@Controller('signUp')
@ApiTags('Auth')
export class SignUpController {
		constructor(
				private readonly userService: UserService,
				private readonly authService: AuthService
		) {}

		@Post()
		async signUp(@Body() request: any, @Res() response: Response) {
            try {
			// return this.authService.signUp(request);
			const user = this.authService.signUp(request);
            console.log("user: ", user);
            response.send(user);
            return "user created";
        } catch (error) {
            console.log("chi haja trat");
            return "cannot create user";
        }	// response.redirect('http://localhost:3000/auth/login');
	}
}