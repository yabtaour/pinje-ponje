import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class GameGateway {
  @SubscribeMessage('gameState')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
