import { Controller, Req, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JWTGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: any) {
    return this.userService.CreateUser(data);
  }

  @Get('fake/:number')
  createFake(@Param ('number') number: string) {
    return this.userService.createFakeUsers(+number);
  }

  @Get()
  FindAllUsers() {
    return this.userService.FindAllUsers();
  }

  @Get(':id')
  FindUserByID(@Param('id') id: string) {
    return this.userService.FindUserByID(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.RemoveUsers(+id);
  }
}
  