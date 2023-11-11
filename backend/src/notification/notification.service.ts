import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
	constructor(
		private readonly prismaService: PrismaService,
	) {}

  async create(createNotificationDto: CreateNotificationDto) {
		const notification = await this.prismaService.notification.create({
			data: {
				type: createNotificationDto.type,
				sender: {
					connect: {
						id: createNotificationDto.senderid,
					},
				},
				receiver: {
					connect: {
						id: createNotificationDto.receiverid,
					},
				},
			},
		});
		if (!notification) {
			throw new HttpException('Notification not created', HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return notification;
    // return 'This action adds a new notification';
  }

  async findAll() {
    const notifications = await this.prismaService.notification.findMany();
		if (!notifications) {
			return [];
		}

		return notifications;
  }

  async findOne(id: number) {
    const notification = await this.prismaService.notification.findUnique({
			where: {
				id,
			},
		});
		if (!notification) {
			return {};
		}

		return notification;
  }

	async findMyNotifications(userId: number) {
		const notifications = await this.prismaService.notification.findMany({
			where: {
				receiverid: userId,
			},
		});
		if (!notifications) {
			return [];
		}

		return notifications;
	}

  // update(id: number, updateNotificationDto: UpdateNotificationDto) {
  //   return `This action updates a #${id} notification`;
  // }

	async markAsRead(id: number, userId: number) {
		const findNotification = await this.prismaService.notification.findFirst({
			where: {
				id,
				receiverid: userId,
			},
		});

		if (!findNotification) {
			throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
		}

		const notification = await this.prismaService.notification.update({
			where: {
				id,
			},
			data: {
				read: true,
			},
		});
		if (!notification) {
			return {};
		}

		return notification;
	}

  remove(id: number, userId: number) {
    const foundNotification = this.prismaService.notification.findFirst({
			where: {
				id,
				receiverid: userId,
			},
		});

		if (!foundNotification) {
			throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
		}

		const notification = this.prismaService.notification.delete({
			where: {
				id,
			},
		});

		return notification;
  }
}
