import { Controller, Get, Post, UseGuards, Res, Req, Redirect } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { get } from 'http';

@Controller('auth')
export class AuthController {
    // constructor(private readonly authService: AuthService) {}

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async redirectTo42Auth() {console.log("redirected");}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async handle42Auth(@Req() request: Request, @Res() response: Response) {
        console.log("returned here");
        console.log(request.user);
        response.redirect('200');
    }
}
