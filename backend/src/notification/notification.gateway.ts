import { OnGatewayInit, OnGatewayDisconnect,
	OnGatewayConnection, WebSocketGateway,
	WebSocketServer, SubscribeMessage,
} from "@nestjs/websockets";
import { Namespace } from "socket.io";
import { NotificationService } from "./notification.service";
import { Inject, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "src/all.exception.filter";
import { forwardRef } from "@nestjs/common";

@UsePipes(new ValidationPipe())
@UseFilters(new AllExceptionsFilter())
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

	@SubscribeMessage('notification')
	async notification(client: any, payload: any) {
		console.log('NotificationGateway notification');
		// return await this.notificationService.create(payload);
	}
}
