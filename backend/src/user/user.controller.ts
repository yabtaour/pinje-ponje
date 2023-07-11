import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: any) {
    return this.userService.CreateUser(data);
  }

  @Get('/all')
  FindAllUsers() {
    return this.userService.FindAllUsers();
  }
  @Get('all/Profiles')
  FindAllProfiles() {
    return this.userService.FindAllProfiles();
  }

  @Get('all/Friends/:id')
  FindAllFriends(@Param('id') id: string) {
    return this.userService.FindAllFriends(+id);
  }

  @Get(':id')
  FindUserByID(@Param('id') id: string) {
    return this.userService.FindUserByID(+id);
  }

  @Get('/profiles/:id')
  findProfileById(@Param() id) {
    return this.userService.FindProfileById(Number(id));
  }

  @Post('profile/SentFriendsInvitation/')
  SentFriendsInvitation(@Body() data: any ) {
    return this.userService.SentFriendsInvitation(data);
  }

  @Post('profile/AccepteFriendRequest/')
  AccepteFriendRequest(@Body() data: any ) {
    return this.userService.AccepteFriendRequest(data);
  }

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
