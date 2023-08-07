import { PartialType } from '@nestjs/mapped-types';
import { CreateGatewayDto } from './create-gateway.dto';

export class UpdateGatewayDto extends PartialType(CreateGatewayDto) {
  id: number;
}
