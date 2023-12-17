import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiHeader,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { Prisma } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { updateProfileDto } from './dto/update-profile.dto';

export function SwaggerUpdateProfile() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiNotFoundResponse({ description: 'Profile not found' }),
    ApiBearerAuth(),
    ApiBody({
      type : updateProfileDto
    }),
    ApiOkResponse({
      description: 'updated profile',
      schema: {
        type: 'object',
        example : Prisma.ProfileScalarFieldEnum
      }
    })
  );
}

export function SwaggerGetAvatar(){
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiNotFoundResponse({ description: 'File not found' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'return avatar path',
    }),
  );
}

export function SwaggerUploadAvatar(){
  return (
    ApiOperation({ summary :"Upload Avatar", description: "Upload Avatar"}),
    ApiConsumes('multipart/form-data', 'image/png'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary'
          },
        },
      },
    })
  );
}

export function SwaggerDeleteAvatar(){
  return applyDecorators(
    ApiOperation({summary: "Delete Avatar", description: "Delete Avatar"}),
    ApiNotFoundResponse({ description: 'Profile not found' }),
    ApiOkResponse({description: "updated profile"}),
    ApiUnauthorizedResponse({description: "Token not found"})
  )
}

export function SwaggerFindProfileById(){
  return applyDecorators(
    ApiOperation({
      summary: 'Get Profile By ID',
      description: 'Get Profile By ID',
    }),
    ApiParam({ name: 'id', description: 'Profile ID' }),
    ApiNotFoundResponse({ description: 'Profile not found' }),
    ApiOkResponse({
      description: "updated profile",
      schema: {
        type: 'object',
        example : Prisma.ProfileScalarFieldEnum
      }
    }),
    ApiUnauthorizedResponse({description: "Token not found"})
  )
}