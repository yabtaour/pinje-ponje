import { ProfilesService } from './profiles.service';
import {  Controller, Get, Post, Body, Patch, Param, Delete,
          UseGuards, Req, UseInterceptors, 
          UploadedFile, Query, BadRequestException, 
          InternalServerErrorException} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from 'src/user/dto/user.dto';
import { storageConfig } from 'src/microservices/storage.config';

@Controller('profiles')
@UseGuards(JWTGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  /* ************************************ */



  @Get('/friends/')
  FindAllFriends(@GetUser() user: UserDto) {
    return this.profilesService.FindAllFriends(+user.sub);
  }

  @Get()
  FindAllProfiles(
    @GetUser() user: UserDto, 
    @Query ('search') search: string,
    @Query ('page') page: number,
    @Query ('limit') limit: number,
    @Query ('sort') sort: string,
    @Query ('frineds') order: string,
    ) {
    return this.profilesService.FindAllProfiles(+user.sub, search);
  }
  @Get(':id')
  findProfileById(@GetUser() user: UserDto, @Param('id') id: string) {
    return this.profilesService.FindProfileById(+user.sub, +id);
  }



  /* ************************************ */




  @Post('add')
  SentFriendsRequest(@GetUser() user: UserDto ,@Body() data: any ) {
    return this.profilesService.SentFriendsRequest(+user.sub, data);
  }

  @Post('/accepte')
  AccepteFriendRequest(@GetUser() user: UserDto, @Body() data: any ) {
    return this.profilesService.AccepteFriendRequest(+user.sub, data);
  }
  
  @Post('/decline')
  DeclineFriendRequest(@GetUser() user: UserDto, @Body() data: any ) {
    return this.profilesService.DeclineFriendRequest(+user.sub, data);
  }

  @Post('/cancel')
  CancelFriendRequest(@GetUser() user: UserDto, @Body() data: any ) {
    return this.profilesService.CancelFriendRequest(+user.sub, data);
  }

  @Delete('/friends')
  removeFriend(@GetUser() user: UserDto, @Body() data: any) {
    return this.profilesService.RemoveFriend(+user.sub, data);
  }

  @Get('/blockedList')
  FindAllBlockedUsers(@GetUser() user: UserDto) {
    return this.profilesService.FindAllBlockedUsers(+user.sub);
  }

  @Post('block/')
  BlockFriend(@GetUser() user: UserDto, @Body() data: any) {
    return this.profilesService.BlockFriend(+user.sub, data);
  }

  @Post('unblock/')
  UnBlockFriend(@GetUser() user: UserDto, @Body() data: any) {
    return this.profilesService.UnBlockFriend(+user.sub, data);
  }


  @Get('avatar')
  getAvatar(@GetUser() user: UserDto) {
    return this.profilesService.getAvatar(+user.sub);
  }
  
  // storage is defined in the top of the file
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', storageConfig))
  uploadAvatar(@GetUser() user: UserDto, @UploadedFile() ima: any, @Req() req: any) {
    try {
      if (!user || !ima)
        throw new BadRequestException('Invalid Request Data.');
      const result = this.profilesService.uploadAvatar(+user.sub, ima);
      return result;
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Delete('avatar')
  deleteAvatar(@GetUser() user: UserDto) {
    return this.profilesService.deleteAvatar(+user.sub);
  }

  // update profile
  @Patch('/update')
  updateProfile(@GetUser() user: UserDto, @Body() data: any) {
    return this.profilesService.updateProfile(+user.sub, data);
  }
}
