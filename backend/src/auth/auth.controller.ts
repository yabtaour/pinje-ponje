import { Controller, Get, Post, Request, UseGuards, Res, Req } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { response } from 'express';
import { get } from 'http';

@Controller('auth')
export class AuthController {
    // constructor(private readonly authService: AuthService) {}

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async redirectTo42Auth() {}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async handle42Auth(@Req() request, @Res() response) {
        return request.user;
    }

    // @UseGuards(AuthGuard('local'))
    // @Post('login')
    // async login(@Request() req) {
    //     return (req.user);
    // }
}
