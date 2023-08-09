import { ProfilesService } from './profiles.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile} from '@nestjs/common';
import { User } from '@prisma/client';
import { request } from 'http';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';
import { extname } from  'path';

// change evrything to id
// add the id of the user in the body of the request
// remove intraid from the body of the request
// uploade avatar

export const storage = {
  storage : diskStorage ({
    destination: './uploads/Avatars',
    filename: (req, file, cb) => {
      console.log(file);
      const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
      console.log(file.originalname);
      const onlyName = file.originalname.split('.')[0];
      const imgName = onlyName + randomName + extname(file.originalname);
      return cb(null, `${imgName}`)
      }
    }
  )
}

@Controller('profiles')
@UseGuards(JWTGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  FindAllProfiles(@Req() request: any) {
    return this.profilesService.FindAllProfiles(+request.user.sub);
  }

  @Get('/uid/:id')
  findProfileById(@Req() request: any, @Param('id') id: string) {
    return this.profilesService.FindProfileById(+request.user.sub, +id);
  }

  @Get('/u/:login')
  findProfileByLogin(@Req() request: any, @Param('login') login: string) {
    return this.profilesService.FindProfileByLogin(+request.user.sub, login);
  }

  @Get('/friends')
  FindAllFriends(@Req() request: any) {
    return this.profilesService.FindAllFriends(+request.user.sub);
  }

  @Post('add')
  SentFriendsRequest(@Req() request: any ,@Body() data: any ) {
    return this.profilesService.SentFriendsRequest(+request.user.sub, data);
  }

  @Post('/accepte')
  AccepteFriendRequest(@Req() request: any, @Body() data: any ) {
    return this.profilesService.AccepteFriendRequest(+request.user.sub, data);
  }
  
  @Post('/decline')
  DeclineFriendRequest(@Req() request: any, @Body() data: any ) {
    return this.profilesService.DeclineFriendRequest(+request.user.sub, data);
  }

  @Post('/cancel')
  CancelFriendRequest(@Req() request: any, @Body() data: any ) {
    return this.profilesService.CancelFriendRequest(+request.user.sub, data);
  }

  @Delete('/friends')
  removeFriend(@Req() request: any, @Body() data: any) {
    return this.profilesService.RemoveFriend(+request.user.sub, data);
  }

  @Get('/blockedList')
  FindAllBlockedUsers(@Req() request: any) {
    return this.profilesService.FindAllBlockedUsers(+request.user.sub);
  }

  @Post('block/')
  BlockFriend(@Req() request: any, @Body() data: any) {
    return this.profilesService.BlockFriend(+request.user.sub, data);
  }

  @Post('unblock/')
  UnBlockFriend(@Req() request: any, @Body() data: any) {
    return this.profilesService.UnBlockFriend(+request.user.sub, data);
  }


  @Get('avatar')
  getAvatar(@Req() request: any) {
    return this.profilesService.getAvatar(+request.user.sub);
  }
  
  // storage is defined in the top of the file
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadAvatar(@Req() request: any, @UploadedFile() ima: any) {
    return this.profilesService.uploadAvatar(+request.user.sub, ima);
  }
  @Delete('avatar')
  deleteAvatar(@Req() request: any) {
    return this.profilesService.deleteAvatar(+request.user.sub);
  }

  // update profile
  @Patch('/update')
  updateProfile(@Req() request: any, @Body() data: any) {
    return this.profilesService.updateProfile(+request.user.sub, data);
  }
}
