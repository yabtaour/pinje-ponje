import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('notification')
export class NotificationController {
  constructor(
		private readonly notificationService: NotificationService,
		private readonly userService: UserService,
	) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
		return await this.notificationService.create(createNotificationDto);
  }

  @Get()
  async findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(+id);
  }

	@Get('my')
	async findMyNotifications(@Req() request: Request) {
		const user = await this.userService.getCurrentUser(request);
		return await this.notificationService.findMyNotifications(user.id);
	}

	@Post('read/:id')
	async markAsRead(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
		const user = await this.userService.getCurrentUser(request);
		return await this.notificationService.markAsRead(+id, user.id);
	}

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
  //   return this.notificationService.update(+id, updateNotificationDto);
  // }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const user = await this.userService.getCurrentUser(request);
		return await this.notificationService.remove(+id, user.id);
  }
}
