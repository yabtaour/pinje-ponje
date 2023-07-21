import { Controller, Get, Post, UseGuards, Res, Req, Redirect, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { get } from 'http';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        // private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Get('42/200/:id')
    async getProfile(@Param() id) {
        console.log(id.id);
        const profile = this.userService.FindUserByID(Number(id.id));
        return profile;
        return ("jesus loves u <3");
    }

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async redirectTo42Auth() {console.log("redirected");}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async handle42Auth(@Req() request: any, @Res() response: Response) {
        // console.log("returned here");
        const user = request.user;
        // console.log(request.user);
        response.setHeader("Authorisation", request.user.token);
        response.redirect(`200/${String(request.user.user.id)}`);
    }
}

