import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: any) {
    return this.userService.CraeteUser(data);
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

  
  @Get('profile/:id')
  FindAllBlockedUsers(@Param('id') id: string) {
    return this.userService.FindAllBlockedUsers(+id);
  }


  @Post('profile/SentFriendsInvitation/')
  SentFriendsInvitation(@Body() data: any ) {
    return this.userService.SentFriendsInvitation(data);
  }
  
  @Post('profile/AccepteFriendRequest/')
  AccepteFriendRequest(@Body() data: any ) {
    return this.userService.AccepteFriendRequest(data);
  }
  
  @Post('profile/BlockFriend/')
  BlockFriend(@Body() data: any ) {
    return this.userService.BlockFriend(data);
  }

  @Post('profile/UnBlockFriend/')
  UnBlockFriend(@Body() data: any ) {
    return this.userService.UnBlockFriend(data);
  }

  @Post('profile/DeclineFriendRequest/')
  DeclineFriendRequest(@Body() data: any ) {
    return this.userService.DeclineFriendRequest(data);
  }



  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //   return this.userService.update(+id, updateUserDto);
    // }
    
    // @Get('x')
    // createX(){
      //   return this.userService.CraeteUser();
      // }

  @Delete('d/:id')
  remove(@Param('id') id: string) {
    return this.userService.RemoveUsers(+id);
  }
  @Post('d/Friend/')
  removeFriend(@Body() data: any) {
    return this.userService.RemoveFriend(data);
  }

}
