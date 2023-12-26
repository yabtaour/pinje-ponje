import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
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

