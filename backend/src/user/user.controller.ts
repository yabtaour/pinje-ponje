import { Controller, Req, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDtoIntra, CreateUserDtoLocal } from './dto/create-user.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDto } from './dto/user.dto';
import { 
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody,
} from '@nestjs/swagger';
import { updateUserDto } from './dto/update-user.dto';
// import { updateUserDto } from './dto/update-user.dto';



@Controller('users')
@ApiTags('Users')
@UseGuards(JWTGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user', 
    description: 'Create a new user and return the user created',
  })
  @ApiBody({ type: CreateUserDtoLocal })
  create(@Body() data: CreateUserDtoLocal) {
    return this.userService.CreateUserLocal(data);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get the current user',
    description: 'Get the current user by token',
  })
  FindUserByToken(@GetUser() request: UserDto) {
    console.log("FindUserByToken: ", request);
    console.log(request.sub);
    return this.userService.FindUserByID(+request.sub);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'Delete a user by ID and return the user deleted',
  })
  remove(@Param('id') id: number) {
    console.log("RemoveUser: ", id);
    if (Number.isNaN(+id))
      throw new HttpException('Bad request', 400);
    return this.userService.RemoveUsers(+id);
  }

  @Put()
  @ApiOperation({
    summary: 'Update a user by ID',
    description: 'Update a user by ID and return the user updated',
  })
  @ApiBody({ type: updateUserDto })
  UpdateUser(@GetUser() request: UserDto, @Body() data: updateUserDto) {
    console.log("UpdateUser: ", data);
    if (Number.isNaN(+request.sub))
      throw new HttpException('Bad request', 400);
    return this.userService.UpdateUser(+request.sub, data);
  }

  
  @Get('fake')
  @ApiOperation({ summary: 'Create fake users', 
  description: 'Create fake users and return the users created'
  })
  createFake() {
  console.log("CreateFakeUsers");
  return this.userService.CreateUsersFake();
  }

  @Get(':id')
  @ApiOperation({summary: 'Get a user by ID',
    description: 'Get a user by ID and return the user'
  })
  @ApiParam({ name: 'id', type: 'number' })
  FindUserByID(@Param('id') id: string) {
    console.log("FindUserByID: ", id);
    if (Number.isNaN(+id))
      throw new HttpException('Bad request', 400);
    return this.userService.FindUserByID(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', 
    description: 'Get all users and return the users',
  })
  FindAllUsers(@Req() request: any) {
    console.log("FindAllUsers: ", request);
    return this.userService.FindAllUsers();
  }
}