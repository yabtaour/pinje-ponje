import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { GatewayService } from './gateway.service';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';

@WebSocketGateway()
export class GatewayGateway {
  constructor(private readonly gatewayService: GatewayService) {}

  @SubscribeMessage('createGateway')
  create(@MessageBody() createGatewayDto: CreateGatewayDto) {
    return this.gatewayService.create(createGatewayDto);
  }

  @SubscribeMessage('findAllGateway')
  findAll() {
    return this.gatewayService.findAll();
  }

  @SubscribeMessage('findOneGateway')
  findOne(@MessageBody() id: number) {
    return this.gatewayService.findOne(id);
  }

  @SubscribeMessage('updateGateway')
  update(@MessageBody() updateGatewayDto: UpdateGatewayDto) {
    return this.gatewayService.update(updateGatewayDto.id, updateGatewayDto);
  }

  @SubscribeMessage('removeGateway')
  remove(@MessageBody() id: number) {
    return this.gatewayService.remove(id);
  }
}
