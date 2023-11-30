import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { CreateUserDtoLocal } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { PaginationLimitDto } from 'src/chat/chat.service';
import { blockAndUnblockUserDto } from './dto/blockAndUnblock-user.dto';
import { FriendsActionsDto } from './dto/FriendsActions-user.dto';
import { UserService } from './user.service';


@UseGuards(JWTGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // @ApiOperation({
  //   summary: 'Create a new user',
  //   description: 'Create a new user and return the user created',
  // })
  // @ApiBody({ type: CreateUserDtoLocal })
  // async create(@Body() data: SignUpDto) {
  //   return this.userService.CreateUserLocal(data);
  // }

  @Get('me')
  @ApiOperation({
    summary: 'Get the current user',
    description: 'Get the current user by token',
  })
  async FindUserByToken(
    @Req() request: any
  ){
    return this.userService.getCurrentUser(request);
  }

  @Get('QRCode')
  @ApiOperation({
    summary: 'Get QRCode',
    description: 'Get QRCode and return the QRCode',
  })
  async getQRCode(
    @Req() request: any
  ){
    const user = await this.userService.getCurrentUser(request);
    return await this.userService.getQRCode(user.id);
  }

  @Delete('delete')
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'Delete a user by ID and return the user deleted',
  })
  async remove(
    @Req() request: any
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.RemoveUsers(user.id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update a user by ID',
    description: 'Update a user by ID and return the user updated',
  })
  @ApiBody({ type: updateUserDto })
  async UpdateUser(
    @Req() request: any,
    @Body() data: updateUserDto
  ){
    const user = await this.userService.getCurrentUser(request);
    console.log(user);
    console.log(data);
    return this.userService.UpdateUser(user.id, data);
  }

  @Post('resetPassword')
  async resetPassword(
    @Req() request: any,
    @Body() data: { old: string; new: string },
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.resetPassword(user, data.old, data.new);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users and return the users',
  })
  async FindAllUsers(
    @Req() request: any, 
    @Query() query: PaginationLimitDto,
    @Query('search') search?: string
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.FindAllUsers(user.id, query, search);
  }

  @Get('/blocked-users')
  @ApiOperation({
    summary: 'Get all blocked users',
    description: 'Get all blocked users and return the users',
  })
  async FindAllBlockedUsers(
    @Req() request: any
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.FindAllBlockedUsers(user.id);
  }

  @Post('/block')
  @ApiOperation({ summary: 'Block Friend', description: 'Block Friend' })
  @ApiBody({ type: blockAndUnblockUserDto })
  async BlockFriend(
    @Req() request: any,
    @Body() data: blockAndUnblockUserDto
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.BlockUser(user.id, data);
  }

  @Delete('/unblock')
  @ApiOperation({ summary: 'UnBlock Friend', description: 'UnBlock Friend' })
  @ApiBody({ type: blockAndUnblockUserDto })
  async UnBlockFriend(
    @Req() request: any,
    @Body() data: blockAndUnblockUserDto,
  ){
    const user = await this.userService.getCurrentUser(request);
    return await this.userService.UnBlockFriend(user.id, data);
  }

  @ApiOperation({
    summary: 'Get All Friends by ID',
    description: 'Get All Friends by ID',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Get(':id/friends')
  async FindAllFriends(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationLimitDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.FindAllFriends(user.id, id, query);
  }

  @Post('/friends/cancel')
  @ApiOperation({
    summary: 'Cancel Friend Request',
    description: 'Cancel Friend Request',
  })
  @ApiBody({ type: FriendsActionsDto })
  async CancelFriendRequest(
    @Req() request: Request,
    @Body() data: FriendsActionsDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.CancelFriendRequest(user.id, data);
  }

  // to do: fix this and optimize it
  @Delete('/friends/unfriend')
  @ApiOperation({ summary: 'Unfriend', description: 'Unfriend' })
  @ApiBody({ type: FriendsActionsDto })
  async Unfriend(
    @Req() request: Request,
    @Body() data: FriendsActionsDto
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.Unfriend(user.id, data);
  }

  @Delete('/friends/decline')
  @ApiOperation({
    summary: 'Decline Friend Request',
    description: 'Decline Friend Request',
  })
  @ApiBody({ type: FriendsActionsDto })
  async DeclineFriendRequest(
    @Req() request: Request,
    @Body() data: FriendsActionsDto,
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.DeclineFriendRequest(user.id, data);
  }

  @Post('/friends/accept')
  @ApiOperation({
    summary: 'Accept Friend Request',
    description: 'Accept Friend Request',
  })
  @ApiBody({ type: FriendsActionsDto })
  async AcceptFriendRequest(
    @Req() request: Request,
    @Body() data: FriendsActionsDto,
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.AcceptFriendRequest(user.id, data);
  }

  @Post('/friends/send')
  @ApiOperation({
    summary: 'Send Friend Request',
    description: 'Send Friend Request',
  })
  @ApiBody({ type: FriendsActionsDto })
  async SendFriendRequest(
    @Req() request: Request,
    @Body() data: FriendsActionsDto,
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.SentFriendRequest(user.id, data);
  }

  @Get('/:id/')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Get a user by ID and return the user',
  })
  @ApiParam({ name: 'id', type: 'number' })
  async FindUserByID(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ){
    const user = await this.userService.getCurrentUser(request);
    return this.userService.FindUserByID(user.id, id);
  }
}
