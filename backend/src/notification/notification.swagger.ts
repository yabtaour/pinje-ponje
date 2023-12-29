import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { Prisma } from '@prisma/client';

export function SwaggerNotifindAll() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiOperation({ description: 'find all the notification in the app' }),
    ApiUnauthorizedResponse({ description: 'Token not found' }),
    ApiBearerAuth(),
  );
}

export function SwaggerCreateNotificationDto() {
  return applyDecorators(
    ApiOperation({
      summary: 'create new notification',
      description: 'create new notification',
    }),
    ApiOkResponse({ description: 'updated profile' }),
    ApiUnauthorizedResponse({ description: 'Token not found' }),
    ApiBearerAuth(),
    ApiBody({
      type: CreateNotificationDto,
    }),
  );
}

export function SwaggerFindMyNotifications() {
  return applyDecorators(
    ApiOperation({
      summary: 'find my notification',
      description: 'find my notification',
    }),
    ApiOkResponse({ description: 'find my notification' }),
    ApiUnauthorizedResponse({ description: 'Token not found' }),
    ApiBearerAuth(),
  );
}

export function SwaggerFindOne() {
  return applyDecorators(
    ApiOperation({
      summary: 'find  notification by id',
      description: 'find  notification by id',
    }),
    ApiOkResponse({ description: 'find  notification by id' }),
    ApiUnauthorizedResponse({ description: 'Token not found' }),
    ApiBearerAuth(),
    ApiParam({name: 'id', type: Number})
  );
}

export function SwaggerMarkAsRead() {
    return applyDecorators(
      ApiOperation({
        summary: 'mark notification as read',
        description: 'mark notification as read',
      }),
      ApiOkResponse({ description: 'mark notification as read' }),
      ApiUnauthorizedResponse({ description: 'Token not found' }),
      ApiBearerAuth(),
      ApiParam({name: 'id', type: Number})
    );
  }

  export function SwaggerDeleteNotification() {
    return applyDecorators(
      ApiOperation({
        summary: 'delete notification',
        description: 'delete notification',
      }),
      ApiOkResponse({ description: 'delete notification' }),
      ApiUnauthorizedResponse({ description: 'Token not found' }),
      ApiBearerAuth(),
      ApiParam({name: 'id', type: Number})
    );
  }
