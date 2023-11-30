import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JWTGuard)
@Controller('notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(
		private readonly notificationService: NotificationService,
		private readonly userService: UserService,
	) {}
	
	@Get()
	async findAll() {
		return this.notificationService.findAll();
	}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
		return await this.notificationService.create(createNotificationDto);
  }

	@Get('my')
	async findMyNotifications(
		@Req() request: Request
	) {
		const user = await this.userService.getCurrentUser(request);
		return await this.notificationService.findMyNotifications(user.id);
	}


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }


	@Post('read/:id')
	async markAsRead(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
		const user = await this.userService.getCurrentUser(request);
		return await this.notificationService.markAsRead(id, user.id);
	}

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
  //   return this.notificationService.update(+id, updateNotificationDto);
  // }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const user = await this.userService.getCurrentUser(request);
		return await this.notificationService.remove(id, user.id);
  }
}
