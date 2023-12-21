import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { FriendsActionsDto } from 'src/user/dto/FriendsActions-user.dto';
import { UserService } from 'src/user/user.service';
import { ChatGateway } from './chat.gateway';
import { ChatService, PaginationLimitDto, joinRoomDto } from './chat.service';
import { chatActionsDto } from './dto/actions-dto';
import { CreateChatDmRoomDto } from './dto/create-chat.dto';
import { updateRoomDto } from './dto/update-room.dto';
import { updateRoomRoleDto } from './dto/update-room-role.dto';

@UseGuards(JWTGuard)
@ApiBearerAuth()
@Controller('chatapi')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatgateway: ChatGateway,
    private readonly userService: UserService,
  ) {}

  @Post('room')
  async createRoom(@Req() request: Request, @Body() data: CreateChatDmRoomDto) {
    try {
      const user = await this.userService.getCurrentUser(request);
      const room = await this.chatService.createRoom(user.id, data);
      this.chatgateway.server.to(String(user.id)).emit('roomCreated', room);
      return room;
    } catch (exception: any) {
      throw new HttpException(exception, exception.status);
    }
  }

  @Get('rooms')
  async getAllRooms(
    @Req() request: Request,
    @Query() query: PaginationLimitDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    console.log(user.id);
    const rooms = await this.chatService.getRoomsByUserId(user.id, query);
    this.chatgateway.server.to(String(user.id)).emit('listOfRooms', rooms);
    return rooms;
  }

  @Get('rooms/list')
  async getListOfRooms(
    @Req() request: Request,
    @Query() query: PaginationLimitDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    console.log(user.id);
    const rooms = await this.chatService.getUnjoinedRooms(user.id, query);
    // this.chatgateway.server.to(String(user.id)).emit('listOfRooms', rooms);
    console.log(rooms);
    return rooms;
  }

  @Get('rooms/:id')
  async getOneRoom(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.userService.getCurrentUser(request);
    const room = await this.chatService.getRoomByid(id);
    this.chatgateway.server.to(String(user.id)).emit('roomDetails', room);
    return room;
  }

  @Put('rooms/:id')
  async updateRoom(
    @Param('id', ParseIntPipe) room_id: number,
    @Req() request: Request,
    @Body() payload: updateRoomDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    const room = await this.chatService.updateRoomData(
      user.id,
      room_id,
      payload,
    );
    return room;
  }

  @Post('rooms/:id/join')
  async joinRoom(
    @Param('id', ParseIntPipe) room_id: number,
    @Req() request: Request,
    @Body() payload: joinRoomDto,
  ) {
    try {
      const user = await this.userService.getCurrentUser(request);
      const room = await this.chatService.joinRoom(user.id, payload, room_id);
      this.chatgateway.server.to(String(user.id)).emit('joinedRoom', room);
      return room;
    } catch (exception: any) {
      throw new HttpException(exception, exception.status);
    }
  }

  @Patch('rooms/:id/role')
  async add_admin(
    @Param('id', ParseIntPipe) room_id: number,
    @Req() request: Request,
    @Body() payload: updateRoomRoleDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    const updateRole = await this.chatService.updateRoomRole(user.id, room_id, payload);
    this.chatgateway.server
      .to(String(payload.userId))
      .emit('roomBroadcast', updateRole);
    return updateRole;
  }

  // @Delete('rooms/:id/admin')
  // async remove_admin(
  //   @Param('id', ParseIntPipe) room_id: number,
  //   @Req() request: Request,
  //   @Body() payload: FriendsActionsDto,
  // ) {
  //   const user = await this.userService.getCurrentUser(request);
  //   const room = await this.chatService.removeAdmin(user.id, room_id, payload);
  //   this.chatgateway.server
  //     .to(String(payload.id))
  //     .emit('you have been promoted to admin', room);
  //   return room;
  // }

  @Post('rooms/:id/invite')
  async invite(
    @Param('id', ParseIntPipe) room_id: number,
    @Req() request: Request,
    @Body() payload: FriendsActionsDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    const room = await this.chatService.inviteToPrivateRoom(
      user.id,
      room_id,
      payload,
    );
    this.chatgateway.server
      .to(String(payload.id))
      .emit('You Have Been Invited to this room', room);
    return room;
  }

  @Post('rooms/:id/leave')
  async leave(
    @Param('id', ParseIntPipe) room_id: number,
    @Req() request: Request,
    @Body() payload: joinRoomDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    const room = await this.chatService.leave_room(user.id, payload, room_id);
    this.chatgateway.server.to(String(user.id)).emit('leave the room', room);
    return room;
  }

  @Get('rooms/:id/users')
  async getRoomUsers(
    @Param('id', ParseIntPipe) room_id: number,
    @Req() request: Request,
    @Query() query: PaginationLimitDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    const roomUers = await this.chatService.getRoomUsers(
      user.id,
      room_id,
      query,
    );
    this.chatgateway.server
      .to(String(user.id))
      .emit('listOfRoomMembers', roomUers);
    return roomUers;
  }

  @Get('rooms/:id/messages')
  async getRoomMessages(
    @Param('id', ParseIntPipe) room_id: number,
    @Req() request: Request,
    @Query() query: PaginationLimitDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    const roomMessages = await this.chatService.getMessages(
      user.id,
      room_id,
      query,
    );
    this.chatgateway.server
      .to(String(user.id))
      .emit('listOfMessages', roomMessages);
    return roomMessages;
  }

  @Post('kick')
  async kick(@Req() request: Request, @Body() payload: chatActionsDto) {
    const user = await this.userService.getCurrentUser(request);
    const updatedMember = await this.chatService.kickUserFromRoom(
      user.id,
      payload,
    );
    this.chatgateway.server
      .to(String(payload.id))
      .emit('roomBroadcast', updatedMember);
    return { status: 'success' };
  }

  @Post('ban')
  async ban(@Req() request: Request, @Body() payload: chatActionsDto) {
    const user = await this.userService.getCurrentUser(request);
    const updatedMember = await this.chatService.BanUserFromRoom(
      user.id,
      payload,
    );
    this.chatgateway.server
      .to(String(payload.id))
      .emit('roomBroadcast', updatedMember);
    return user;
  }

  @Post('unban')
  async unban(@Req() request: Request, @Body() payload: chatActionsDto) {
    const user = await this.userService.getCurrentUser(request);
    const updatedMember = await this.chatService.UnBanUserFromRoom(
      user.id,
      payload,
    );
    this.chatgateway.server
      .to(String(payload.id))
      .emit('roomBroadcast', updatedMember);
    return user;
  }

  @Post('mute')
  async mute(@Req() request: Request, @Body() payload: chatActionsDto) {
    const user = await this.userService.getCurrentUser(request);
    const updatedMember = await this.chatService.MuteUserFromRoom(
      user.id,
      payload,
    );
    this.chatgateway.server
      .to(String(payload.id))
      .emit('roomBroadcast', updatedMember);

    console.log(updatedMember);
    return user;
  }

  @Post('unmute')
  async unmute(@Req() request: Request, @Body() payload: chatActionsDto) {
    const user = await this.userService.getCurrentUser(request);
    const updatedMember = await this.chatService.unMuteUser(user.id, payload);
    this.chatgateway.server
      .to(String(payload.id))
      .emit('roomBroadcast', updatedMember);
    return user;
  }
}
