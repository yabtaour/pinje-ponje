import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation, ApiParam,
  ApiProperty,
  ApiTags
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { storageConfig } from '../microservices/storage.config';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { ProfilesService } from './profiles.service';
// import { updateUserDto } from 'src/user/dto/update-user.dto';
import { updateProfileDto } from './dto/update-profile.dto';
import { fr } from '@faker-js/faker';
import { query } from 'express';
import { PaginationLimitDto } from 'src/chat/chat.service';

export class PostObject {
  @ApiProperty()
  id: number;
}

@Controller('profiles')
@ApiTags('Profiles')
@UseGuards(JWTGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly userServices: UserService
  ) {}

  // Only Update Profile: Avatar - Username - Firstname - Lastname - Email - Phone - Bio
  @Patch()
  @ApiOperation({ summary: 'Update Profile', description: 'Update Profile Data' })
  @ApiBody({ type: updateProfileDto })
  updateProfile(@GetUser() user: UserDto, @Body() data: updateProfileDto) {
    console.log("updateProfile: ", user);
    return this.profilesService.updateProfile(user, data);
  }

  @Get('/blocked-users')
  @ApiOperation({ summary: 'Get All Blocked Users', description: 'Get All Blocked Users' })
  FindAllBlockedUsers(@GetUser() user: UserDto) {
    console.log("FindAllBlockedUsers: ", user);
    return this.profilesService.FindAllBlockedUsers(+user.sub);
  }

  @Get('avatar')
  @ApiOperation({ summary: 'Get Avatar', description: 'Get Avatar' })
  getAvatar(@GetUser() user: UserDto) {
    console.log("getAvatar: ", user);
    return this.profilesService.getAvatar(+user.sub);
  }

  // Get Profile By ID
  @ApiOperation({ summary: 'Get Profile By ID', description: 'Get Profile By ID' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @Get(':id')
  findProfileById(@GetUser() user: UserDto, @Param('id') id: string) {
    console.log("findProfileById: ", user);
    return this.profilesService.FindProfileById(+user.sub, +id);
  }

  // Get All Friends by ID
  @ApiOperation({ summary: 'Get All Friends by ID', description: 'Get All Friends by ID' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @Get(':id/friends')
  FindAllFriends(
    @GetUser() user: UserDto, 
    @Param('id') id: string, 
    @Query () query: PaginationLimitDto
    ){
    console.log("FindAllFriends: ", user);
    return this.profilesService.FindAllFriends(+user.sub, +id, query);
  }
  

  // @Get()
  // FindAllProfiles(
  //   @GetUser() user: UserDto, 
  //   @Query ('search') search: string,
  //   ) {
  //   return this.profilesService.FindAllProfiles(+user.sub, search);
  // }


  @Post('/friends/send')
  @ApiOperation({ summary: 'Send Friend Request', description: 'Send Friend Request' })
  @ApiBody({ type: PostObject })
  SentFriendsRequest(@GetUser() user: UserDto ,@Body() data: any ) {
    console.log("SentFriendsRequest: ", data);
    return this.profilesService.SentFriendsRequest(+user.sub, data);
  }


  @Post('/friends/accept')
  @ApiOperation({ summary: 'Accept Friend Request', description: 'Accept Friend Request' })
  @ApiBody({ type: PostObject })
  async AccepteFriendRequest(@Body() data: {senderId: number}, @Req() req: Request ) {
		console.log("AccepteFriendRequest: ", data);
		const user = await this.userServices.getCurrentUser(req);
    console.log("AccepteFriendRequest: ", data);
    return this.profilesService.AccepteFriendRequest(+user.id, data);
  }
  
  @Post('/friends/reject')
  @ApiOperation({ summary: 'Decline Friend Request', description: 'Decline Friend Request' })
  @ApiBody({ type: PostObject })
  DeclineFriendRequest(@GetUser() user: UserDto, @Body() data: any ) {
    console.log("DeclineFriendRequest: ", data);
    return this.profilesService.DeclineFriendRequest(+user.sub, data);
  }

  @Post('/friends/cancel')
  @ApiOperation({ summary: 'Cancel Friend Request', description: 'Cancel Friend Request' })
  @ApiBody({ type: PostObject })
  CancelFriendRequest(@GetUser() user: UserDto, @Body() data: any ) {
    console.log("CancelFriendRequest: ", data);
    return this.profilesService.CancelFriendRequest(+user.sub, data);
  }

  
  @Post('friend/block')
  @ApiOperation({ summary: 'Block Friend', description: 'Block Friend' })
  @ApiBody({ type: PostObject })
  BlockFriend(@GetUser() user: UserDto, @Body() data: any) {
    console.log("BlockFriend: ", data);
    return this.profilesService.BlockFriend(+user.sub, data);
  }
  
  @Post('friend/unblock')
  @ApiOperation({ summary: 'UnBlock Friend', description: 'UnBlock Friend' })
  @ApiBody({ type: PostObject })
  UnBlockFriend(@GetUser() user: UserDto, @Body() data: any) {
    console.log("UnBlockFriend: ", data);
    return this.profilesService.UnBlockFriend(+user.sub, data);
  }

  @Delete('/friends/unfriend')
  @ApiOperation({ summary: 'Remove Friend', description: 'Remove Friend' })
  @ApiBody({ type: PostObject })
  removeFriend(@GetUser() user: UserDto, @Body() data: any) {
    console.log("RemoveFriend: ", data);
    return this.profilesService.RemoveFriend(+user.sub, data);
  }

  
  // storage is defined in the top of the file
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', storageConfig))
  @ApiOperation({ summary: 'Upload Avatar', description: 'Upload Avatar' })
  @ApiConsumes('multipart/form-data', 'image/png')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  uploadAvatar(@GetUser() user: UserDto, @UploadedFile() ima: any, @Req() req: any) {
    try {
      if (!user || !ima)
        throw new BadRequestException('Invalid Request Data.');
      const result = this.profilesService.uploadAvatar(1, ima);
      return result;
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }



  @Delete('avatar')
  @ApiOperation({ summary: 'Delete Avatar', description: 'Delete Avatar' })
  deleteAvatar(@GetUser() user: UserDto) {
    console.log("deleteAvatar: ", user);
    return this.profilesService.deleteAvatar(+user.sub);
  }

}


