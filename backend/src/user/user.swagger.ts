import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { resretPasswordDto, updateUserDto } from './dto/update-user.dto';
import { blockAndUnblockUserDto } from './dto/blockAndUnblock-user.dto';
import { FriendsActionsDto } from './dto/FriendsActions-user.dto';

export function SwaggerGetMe() {
  return applyDecorators(
    ApiNotFoundResponse({ description: 'Profile not found' }),
    ApiForbiddenResponse({ description: 'Token not found' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'The user who requested this route.',
      schema: {
        type: 'object',
      },
    }),
  );
}

export function SwaggerDeleteUser() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Delete user',
      description: 'user can delete himself',
    }),
  );
}

export function SwaggerUpdateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a user by ID',
      description: 'Update a user by ID and return the user updated',
    }),
    ApiBody({ type: updateUserDto }),
  );
}

export function SwaggerResetPassword() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'reset user password',
      description: 'reset user password',
    }),
    ApiBody({
      type: resretPasswordDto,
    }),
  );
}

export function SwaggerFindAllUsers() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found | Invalid signature | Invalid token',
    }),
    ApiOperation({
      summary: 'Get all users',
      description: 'Get all users and return the users',
    }),
    ApiQuery({
      name: 'search',
      description: 'Optional search query for filtering users',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'skip',
      description: 'Optional page number for pagination',
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'take',
      description: 'Optional page size for pagination',
      required: false,
      type: Number,
    }),
  );
}

export function SwaggerQRcode() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Get QRCode',
      description: 'Get QRCode and return the QRCode',
    }),
  );
}

export function SwaggerBlockedList() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Get all blocked users',
      description: 'Get all blocked users and return the users',
    }),
  );
}

export function SwaggerBlock() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({ summary: 'block user', description: 'block user' }),
    ApiBody({ type: blockAndUnblockUserDto }),
  );
}

export function SwaggerUnblock() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({ summary: 'unblock user', description: 'unblock user' }),
    ApiBody({ type: blockAndUnblockUserDto }),
  );
}

export function SwaggerFindAllFriends() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Get All Friends by ID',
      description: 'Get All Friends by ID',
    }),
    ApiParam({ name: 'id', description: 'user ID' }),
  );
}

export function SwaggerCancelRequest() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Cancel Friend Request',
      description: 'Cancel Friend Request',
    }),
    ApiBody({ type: FriendsActionsDto }),
  );
}

export function SwaggerUnfriend() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({ summary: 'Unfriend', description: 'Unfriend' }),
    ApiBody({ type: FriendsActionsDto }),
  );
}

export function SwaggerDecline() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Decline Friend Request',
      description: 'Decline Friend Request',
    }),
    ApiBody({ type: FriendsActionsDto }),
  );
}

export function SwaggerAccept() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Accept Friend Request',
      description: 'Accept Friend Request',
    }),
    ApiBody({ type: FriendsActionsDto }),
  );
}

export function SwaggerSend() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Send Friend Request',
      description: 'Send Friend Request',
    }),
    ApiBody({ type: FriendsActionsDto }),
  );
}

export function SwaggerFindUserById() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Token not found |  invalid signature  | Invalid token',
    }),
    ApiOperation({
      summary: 'Get a user by ID',
      description: 'Get a user by ID and return the user',
    }),
    ApiParam({ name: 'id', type: 'number' }),
  );
}
