import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomName: string) {
    client.join(roomName);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    const { roomName, message } = payload;
    // Save the message to the database (you can do this here or in a separate service)

    // Emit the message to the members of the specific chat room
    this.server.to(roomName).emit('newMessage', message);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomName: string) {
    client.leave(roomName);
  }
}