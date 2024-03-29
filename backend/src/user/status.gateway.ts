import { Inject, Injectable, UseFilters, UsePipes, ValidationPipe, forwardRef } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { GlobalExceptionFilter } from "src/global-exception.filter";
import { UserService } from "./user.service";


@UsePipes(new ValidationPipe())
@UseFilters(new GlobalExceptionFilter())
@WebSocketGateway({
    namespace: 'status',
    cors: {
        origin: '*'
    }
})
@Injectable()
export class StatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;
    
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        // private userService: UserService,
    ) {}

    afterInit(server: Server) {
    }

    handleConnection(client: any, ...args: any[]) {
        client.join('status');
        const payload: {
            status: string,
            user: number,
        } = {
            status: 'online',
            user: Number(client.id),
        };
        this.server.to('status').emit('status', payload);
    }

    handleDisconnect(client: any) {
    }

    onDisconnect(client: any) {
        const payload: {
            status: string,
            user: number,
        } = {
            status: 'offline',
            user: Number(client.id),
        };
        this.server.to('status').emit('status', payload);
    }
    // @SubscribeMessage('queue')
}
