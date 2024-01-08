import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';

import { Status } from '@prisma/client';
import { currentGames } from 'src/game/game.gateway';
import { GameService } from 'src/game/game.service';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => NotificationGateway))
    private notificationGateway: NotificationGateway,
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => GameService))
    private gameService: GameService,
  ) {}

  async getGameIdUsingCurrentGames(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'OFFLINE',
      },
    });
    let gameId = -1;
    let enemyId = -1;
    currentGames.forEach(async (gameState, key) => {
      if (gameState.player1.id === userId || gameState.player2.id === userId) {
        if (gameState.player1.id === userId) {
          enemyId = gameState.player2.id;
          gameId = key;
        } else if (gameState.player2.id === userId) {
          enemyId = gameState.player1.id;
          gameId = key;
        }
        await this.gameService.finishGame(enemyId, userId, gameId);
      }
    });

    return gameId;
  }

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
      throw new HttpException(
        'Notification not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await this.notificationGateway.sendNotificationToUser(
      createNotificationDto.receiverId.toString(),
      notification,
    );
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

  async remove(id: number, userId: number) {
    const foundNotification = await this.prismaService.notification.findFirst({
      where: {
        id,
        receiverid: userId,
      },
    });
    if (!foundNotification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }

    const notification = await this.prismaService.notification.delete({
      where: {
        id,
      },
    });

    return notification;
  }

  async updateUserStatus(userId: number, status: Status) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        status: status,
      },
    });
    return user;
  }
}
