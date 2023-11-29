import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
	constructor(
		@Inject(forwardRef(() => NotificationGateway))
		private notificationGateway: NotificationGateway,
		private readonly prismaService: PrismaService,
	) {}

  async create(createNotificationDto: CreateNotificationDto) {
		const notification = await this.prismaService.notification.create({
			data: {
				type: createNotificationDto.type,
				sender: {
					connect: {
						id: createNotificationDto.senderId,
					},
				},
				receiver: {
					connect: {
						id: createNotificationDto.receiverId,
					},
				},
			},
		});
		if (!notification) {
			throw new HttpException('Notification not created', HttpStatus.INTERNAL_SERVER_ERROR);
		}
		this.notificationGateway.sendNotificationToUser(createNotificationDto.receiverId.toString(), notification);
		return notification;
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
