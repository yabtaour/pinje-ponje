import { ProfilesService } from './profiles.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, Query} from '@nestjs/common';
import { User } from '@prisma/client';
import { request } from 'http';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from  'multer';
import { extname } from  'path';
import { clearConfigCache } from 'prettier';
import { UserDto } from 'src/user/dto/user.dto';

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

  /* ************************************ */



  @Get('/friends/')
  FindAllFriends(@GetUser() user: UserDto) {
    return this.profilesService.FindAllFriends(+user.sub);
  }

  @Get()
  FindAllProfiles(@GetUser() user: UserDto, @Query ('search') search: string) {
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
  @UseInterceptors(FileInterceptor('file', storage))
  uploadAvatar(@GetUser() user: UserDto, @UploadedFile() ima: any) {
    return this.profilesService.uploadAvatar(+user.sub, ima);
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
