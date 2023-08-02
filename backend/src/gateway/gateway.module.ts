import { Module } from '@nestjs/common';
import { chatGateway } from './chat.gateway';
import { alertGateway } from './alert.gateway';

@Module({
  providers: [chatGateway, alertGateway]
})
export class GatewayModule {}
