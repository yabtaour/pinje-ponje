import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  SwaggerCreateNotificationDto,
  SwaggerDeleteNotification,
  SwaggerFindMyNotifications,
  SwaggerFindOne,
  SwaggerMarkAsRead,
  SwaggerNotifindAll,
} from './notification.swagger';

@UseGuards(JWTGuard)
@Controller('notification')
@ApiTags('notification')
@ApiBearerAuth()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @SwaggerNotifindAll()
  async findAll() {
    return await this.notificationService.findAll();
  }

  @Post()
  @SwaggerCreateNotificationDto()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get('my')
  @SwaggerFindMyNotifications()
  async findMyNotifications(@Req() request: Request) {
    const user = await this.userService.getCurrentUser(request);
    return await this.notificationService.findMyNotifications(user.id);
  }

  @Get(':id')
  @SwaggerFindOne()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }

  @Post('read/:id')
  @SwaggerMarkAsRead()
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return await this.notificationService.markAsRead(id, user.id);
  }

  @Delete(':id')
  @SwaggerDeleteNotification()
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const user = await this.userService.getCurrentUser(request);
    return await this.notificationService.remove(id, user.id);
  }
}
