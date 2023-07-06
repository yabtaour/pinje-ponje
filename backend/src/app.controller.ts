
import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Get('auth/login')
  async login(@Request() req) {
    console.log(req);
    return req.user;
  }
}
