import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation, ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { CreateUserDtoLocal } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';


@UseGuards(JWTGuard)
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user', 
    description: 'Create a new user and return the user created',
  })
  @ApiBody({ type: CreateUserDtoLocal })
  async create(@Body() data: CreateUserDtoLocal) {
    return this.userService.CreateUserLocal(data);
  }
  
  @Get('me')
  @ApiOperation({
    summary: 'Get the current user',
    description: 'Get the current user by token',
  })
  async FindUserByToken(@Req() request: any) {
    return this.userService.getCurrentUser(request);
  }
  
  @Get('QRCode')
  @ApiOperation({ summary: 'Get QRCode', 
    description: 'Get QRCode and return the QRCode',
  })
  async getQRCode(@Req() request: any) {
    const user = await this.userService.getCurrentUser(request);
    console.log(user);
    return await this.userService.getQRCode(user.id);
  }

  @Delete('delete')
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'Delete a user by ID and return the user deleted',
  })
  async remove(@Req() request: any) {
		const user = await this.userService.getCurrentUser(request);
    return this.userService.RemoveUsers(user.id);
  }

  @Put()
  @ApiOperation({
    summary: 'Update a user by ID',
    description: 'Update a user by ID and return the user updated',
  })
  @ApiBody({ type: updateUserDto })
  async UpdateUser(@Req() request: any, @Body() data: updateUserDto) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.UpdateUser(user.id, data);
  }

  @Get('QRCode')
  @ApiOperation({ summary: 'Get QRCode', 
    description: 'Get QRCode and return the QRCode',
  })
  async getQRCode(@Req() request: any) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.getQRCode(user.id);
  }

  
  @Get('fake')
  @ApiOperation({ summary: 'Create fake users', 
  description: 'Create fake users and return the users created'
  })
  async createFake() {
  	return this.userService.CreateUsersFake();
  }

  @Get(':id')
  @ApiOperation({summary: 'Get a user by ID',
    description: 'Get a user by ID and return the user'
  })
  @ApiParam({ name: 'id', type: 'number' })
  async FindUserByID(@Param('id', ParseIntPipe) id: number) {
    return this.userService.FindUserByID(id);
  }

  @Post('resetPassword')
  async resetPassword(@Req() request: any, @Body() data: {old: string, new: string}) {
    const user = await this.userService.getCurrentUser(request);
    return this.userService.resetPassword(user, data.old, data.new);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', 
    description: 'Get all users and return the users',
  })
  async FindAllUsers(@Req() request: any) {
    return this.userService.FindAllUsers();
  }

}