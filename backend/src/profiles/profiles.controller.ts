import { UserService } from 'src/user/user.service';
import { ProfilesService } from './profiles.service';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly userServices: UserService
  ) {}

  @Get()
  FindAllProfiles() {
    return this.profilesService.FindAllProfiles();
  }

  @Get(':id/friends')
  FindAllFriends(@Param('id') id: string) {
    return this.profilesService.FindAllFriends(+id);
  }

  @Get(':id/blockeds')
  FindAllBlockedUsers(@Param('id') id: string) {
    return this.profilesService.FindAllBlockedUsers(+id);
  }

  @Get(':id')
  findProfileById(@Param() id) {
    return this.profilesService.FindProfileById(Number(id));
  }

  @Post(':id/add')
  SentFriendsInvitation(@Body() data: any ) {
    return this.profilesService.SentFriendsInvitation(data);
  }
  
  @Post(':id/accepte')
  AccepteFriendRequest(@Body() data: any ) {
    return this.profilesService.AccepteFriendRequest(data);
  }
  
  @Post(':id/decline')
  DeclineFriendRequest(@Body() data: any ) {
    return this.profilesService.DeclineFriendRequest(data);
  }

  @Post(':id/block')
  BlockFriend(@Body() data: any ) {
    return this.profilesService.BlockFriend(data);
  }

  @Post(':id/unblock')
  UnBlockFriend(@Body() data: any ) {
    return this.profilesService.UnBlockFriend(data);
  }

  @Delete(':id/friends')
  removeFriend(@Body() data: any) {
    return this.profilesService.RemoveFriend(data);
  }

  @Delete(':id')
  removeProfile(@Body() data: any, @Param('id') id: number) {
    return this.profilesService.RemoveProfiles(Number(id));
  }
}
