import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: any) {
    return this.userService.CraeteUser(data);
  }

  @Get()
  FindAllUsers() {
    return this.userService.FindAllUsers();
  }
  @Get('Profiles')
  FindAllProfiles() {
    return this.userService.FindAllProfiles();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Get('x')
  // createX(){
  //   return this.userService.CraeteUser();
  // }

  @Get('d/:id')
  remove(@Param('id') id: string) {
    return this.userService.RemoveUsers(+id);
  }
}
