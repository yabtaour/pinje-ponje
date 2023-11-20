import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { storageConfig } from '../microservices/storage.config';
import { UserService } from '../user/user.service';
import { ProfilesService } from './profiles.service';
import { updateProfileDto } from './dto/update-profile.dto';
import { SwaggerDeleteAvatar, SwaggerFindProfileById, SwaggerGetAvatar, SwaggerUpdateProfile, SwaggerUploadAvatar } from './profile.swagger';

@Controller('profiles')
@ApiTags('Profiles')
@UseGuards(JWTGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly userServices: UserService,
  ) {}

  // Only Update Profile: Avatar - Username - Firstname - Lastname - Email - Phone - Bio
  @Patch()
  @SwaggerUpdateProfile()
  async updateProfile(
    @Req() request: any,
    @Body() data: updateProfileDto
  ){
    const user = await this.userServices.getCurrentUser(request);
    return this.profilesService.updateProfile(user.id, data);
  }

  @Get('avatar')
  @SwaggerGetAvatar()
  async getAvatar(
    @Req() request: any
  ){
    const user = await this.userServices.getCurrentUser(request);
    return this.profilesService.getAvatar(user.id);
  }

  // storage is defined in the top of the file
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', storageConfig))
  @SwaggerUploadAvatar()
  @ApiConsumes('multipart/form-data', 'image/png')
  async uploadAvatar(
    @UploadedFile() ima: any,
    @Req() req: any,
  ){
    const user = await this.userServices.getCurrentUser(req);
    return await this.profilesService.uploadAvatar(user.id, ima);
  }

  @Delete('avatar')
  @SwaggerDeleteAvatar()
  async deleteAvatar(
    @Req() request: any
  ){
    const user = await this.userServices.getCurrentUser(request);
    return this.profilesService.deleteAvatar(user.id);
  }

  // Get Profile By ID
  // @ApiOperation({
  //   summary: 'Get Profile By ID',
  //   description: 'Get Profile By ID',
  // })
  // @ApiParam({ name: 'id', description: 'Profile ID' })
  @Get(':id')
  @SwaggerFindProfileById()
  async findProfileById(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ){
    const user = await this.userServices.getCurrentUser(request);
    return this.profilesService.FindProfileById(user.id, id);
  }
}
