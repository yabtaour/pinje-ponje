import { Inject, UseFilters, UsePipes, ValidationPipe, forwardRef } from "@nestjs/common";
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Namespace } from "socket.io";
import { GlobalExceptionFilter } from "src/global-exception.filter";
import { NotificationService } from "./notification.service";

@UsePipes(new ValidationPipe())
@UseFilters(new GlobalExceptionFilter())
@WebSocketGateway({
	namespace: 'notification',
	cors: {
		origin: '*',
	},
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	constructor(
		@Inject(forwardRef(() => NotificationService))
		private readonly notificationService: NotificationService,
	) {}

	@WebSocketServer()
	server:	Namespace;


	afterInit(server: Namespace) {
		console.log('NotificationGateway Init');
		// this.motificationService.server = server;
	}

	handleDisconnect(client: any) {
		console.log('NotificationGateway Disconnect');
	}

	handleConnection(client: any, ...args: any[]) {
		console.log('NotificationGateway Connection');
	}

	async sendNotificationToUser(userId: string, notification: any) {
		console.log('NotificationGateway sendNotificationToUser');
		this.server.to(userId).emit('notification', notification);
	}

	@SubscribeMessage('notification')
	async notification(client: any, payload: any) {
		console.log('NotificationGateway notification');
		// return await this.notificationService.create(payload);
	}
}
