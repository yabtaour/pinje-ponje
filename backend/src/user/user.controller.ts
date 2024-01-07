import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationLimitDto } from 'src/chat/dto/pagination-dto';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { FriendsActionsDto } from './dto/FriendsActions-user.dto';
import { blockAndUnblockUserDto } from './dto/blockAndUnblock-user.dto';
import { resretPasswordDto, updateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import {
  SwaggerAccept,
  SwaggerBlock,
  SwaggerBlockedList,
  SwaggerCancelRequest,
  SwaggerDecline,
  SwaggerDeleteUser,
  SwaggerFindAllFriends,
  SwaggerFindAllUsers,
  SwaggerFindUserById,
  SwaggerGetMe,
  SwaggerQRcode,
  SwaggerResetPassword,
  SwaggerSend,
  SwaggerUnblock,
  SwaggerUnfriend,
  SwaggerUpdateUser,
} from './user.swagger';

@UseGuards(JWTGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @SwaggerGetMe()
  async FindUserByToken(@Req() request: any) {
    const user = await this.userService.getCurrentUser(request);
    delete user.password;
    delete user.twoFactorSecret;
    return user;
  }

  @Post('verify-token')
  async VerifyToken() {
    return { status: 'ok' };
  }

  @Get('QRCode')
  @SwaggerQRcode()
  async getQRCode(@Req() request: any) {
    const user = await this.userService.getCurrentUser(request);
    return await this.userService.getQRCode(user.id);
  }

  @Delete('delete')
  @SwaggerDeleteUser()
  async remove(@Req() request: any) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.RemoveUsers(user.id);
  }

  @Patch()
  @SwaggerUpdateUser()
  async UpdateUser(@Req() request: any, @Body() data: updateUserDto) {
    const user = await this.userService.getCurrentUser(request);
    console.log(user);
    console.log(data);
    return this.userService.UpdateUser(user.id, data);
  }

  @Post('resetPassword')
  @SwaggerResetPassword()
  async resetPassword(@Req() request: any, @Body() data: resretPasswordDto) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.resetPassword(user, data.old, data.new);
  }

  @Get()
  @SwaggerFindAllUsers()
  async FindAllUsers(
    @Req() request: any,
    @Query() query: PaginationLimitDto,
    @Query('search') search?: string,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.FindAllUsers(user.id, query, search);
  }

  @Get('rankedList')
  @SwaggerFindAllUsers()
  async GetRankedList(
    @Req() request: any,
    @Query() query: PaginationLimitDto,
    @Query('search') search?: string,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.GetRankedList(user.id, query, search);
  }

  @Get('/blocked-users')
  @SwaggerBlockedList()
  async FindAllBlockedUsers(@Req() request: any) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.FindAllBlockedUsers(user.id);
  }

  @Post('/block')
  @SwaggerBlock()
  async BlockFriend(@Req() request: any, @Body() data: blockAndUnblockUserDto) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.BlockUser(user.id, data);
  }

  @Post('/unblock')
  @SwaggerUnblock()
  async UnBlockFriend(
    @Req() request: any,
    @Body() data: blockAndUnblockUserDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return await this.userService.UnBlockFriend(user.id, data);
  }

  @Get(':id/friends')
  @SwaggerFindAllFriends()
  async FindAllFriends(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationLimitDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.FindAllFriends(user.id, id, query);
  }

  @Post('/friends/cancel')
  @SwaggerCancelRequest()
  async CancelFriendRequest(
    @Req() request: Request,
    @Body() data: FriendsActionsDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.CancelFriendRequest(user.id, data);
  }

  @Post('/friends/unfriend')
  @SwaggerUnfriend()
  async Unfriend(@Req() request: Request, @Body() data: FriendsActionsDto) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.Unfriend(user.id, data);
  }

  @Post('/friends/decline')
  @SwaggerDecline()
  async DeclineFriendRequest(
    @Req() request: Request,
    @Body() data: FriendsActionsDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.DeclineFriendRequest(user.id, data);
  }

  @Post('/friends/accept')
  @SwaggerAccept()
  async AcceptFriendRequest(
    @Req() request: Request,
    @Body() data: FriendsActionsDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.AcceptFriendRequest(user.id, data);
  }

  @Post('/friends/send')
  @SwaggerSend()
  async SendFriendRequest(
    @Req() request: Request,
    @Body() data: FriendsActionsDto,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.SentFriendRequest(user.id, data);
  }

  @Get('/:id/')
  @SwaggerFindUserById()
  async FindUserByID(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.FindUserByID(user.id, id);
  }
}
