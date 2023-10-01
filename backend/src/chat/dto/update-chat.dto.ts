import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDmRoomDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDmRoomDto) {}
