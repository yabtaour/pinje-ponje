import {
  Inject,
  UseFilters,
  UsePipes,
  ValidationPipe,
  forwardRef,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { NotificationService } from './notification.service';
import { OnEvent } from '@nestjs/event-emitter';

@UsePipes(new ValidationPipe())
@UseFilters(new GlobalExceptionFilter())
@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  @WebSocketServer()
  server: Namespace;

  async afterInit(server: Namespace) {
    // this.motificationService.server = server;
  }

  async handleDisconnect(client: any) {

    this.notificationService.getGameIdUsingCurrentGames(parseInt(client.id));
    const clientId = client.id;
  }

  async handleConnection(client: any, ...args: any[]) {
    this.notificationService.updateUserStatus(parseInt(client.id), 'ONLINE');
 
  }

  @OnEvent('notification', { promisify: true, async: true })
  async sendNotificationToUser(userId: string, notification: any) {
    this.server.to(userId).emit('notification', notification);
  }

  @SubscribeMessage('notification')
  async notification(client: any, payload: any) {
    // return await this.notificationService.create(payload);
  }
}