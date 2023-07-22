import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
// import { AuthGuard } from '@nestjs/passport';
// import { FortyTwoStrategy } from 'src/auth/42.strategy';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: any) {
    return this.userService.CreateUser(data);
  }

  @Get('users')
  FindAllUsers() {
    return this.userService.FindAllUsers();
  }
  // @Get('profiles')
  // FindAllProfiles() {
  //   return this.userService.FindAllProfiles();
  // }

  // @Get('users/:id/friends')
  // FindAllFriends(@Param('id') id: string) {
  //   return this.userService.FindAllFriends(+id);
  // }

  @Get('users/:id')
  FindUserByID(@Param('id') id: string) {
    return this.userService.FindUserByID(+id);
  }

  
  // @Get('users/:id/blockeds')
  // FindAllBlockedUsers(@Param('id') id: string) {
  //   return this.userService.FindAllBlockedUsers(+id);
  // }

  // @Get('profiles/:id')
  // findProfileById(@Param() id) {
  //   return this.userService.FindProfileById(Number(id));
  // }

  // @Post('users/:id/add')
  // SentFriendsInvitation(@Body() data: any ) {
  //   return this.userService.SentFriendsInvitation(data);
  // }
  
  // @Post('users/:id/accepte')
  // AccepteFriendRequest(@Body() data: any ) {
  //   return this.userService.AccepteFriendRequest(data);
  // }
  
  // @Post('users/:id/decline')
  // DeclineFriendRequest(@Body() data: any ) {
  //   return this.userService.DeclineFriendRequest(data);
  // }

  // @Post('users/:id/block')
  // BlockFriend(@Body() data: any ) {
  //   return this.userService.BlockFriend(data);
  // }

  // @Post('users/:id/unblock')
  // UnBlockFriend(@Body() data: any ) {
  //   return this.userService.UnBlockFriend(data);
  // }


  @Delete('users/:id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    try {
      return this.userService.RemoveUsers(Number(id));
    } catch (error) {
      console.log(error);
    }
  }
  // @Delete('users/:id/friends')
  // removeFriend(@Body() data: any) {
  //   return this.userService.RemoveFriend(data);
  // }

}
