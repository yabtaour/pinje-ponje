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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { UserService } from '../user/user.service';
import { updateProfileDto } from './dto/update-profile.dto';
import {
  SwaggerDeleteAvatar,
  SwaggerFindProfileById,
  SwaggerGetAvatar,
  SwaggerUpdateProfile,
} from './profile.swagger';
import { ProfilesService } from './profiles.service';

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
  async updateProfile(@Req() request: any, @Body() data: updateProfileDto) {
    const user = await this.userServices.getCurrentUser(request);
    return this.profilesService.updateProfile(user.id, data);
  }

  @Get('avatar')
  @SwaggerGetAvatar()
  async getAvatar(@Req() request: any) {
    const user = await this.userServices.getCurrentUser(request);
    return this.profilesService.getAvatar(user.id);
  }

  @Post('avatar')
  async uploadAvatar(
    @Body('avatarBase64') avatarBase64: string,
    @Req() req: any,
  ) {
    const user = await this.userServices.getCurrentUser(req);
    return await this.profilesService.uploadAvatar(user.id, avatarBase64);
  }

  @Delete('avatar')
  @SwaggerDeleteAvatar()
  async deleteAvatar(@Req() request: any) {
    const user = await this.userServices.getCurrentUser(request);
    return this.profilesService.deleteAvatar(user.id);
  }

  @Get(':id')
  @SwaggerFindProfileById()
  async findProfileById(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.userServices.getCurrentUser(request);
    return this.profilesService.FindProfileById(user.id, id);
  }
}
