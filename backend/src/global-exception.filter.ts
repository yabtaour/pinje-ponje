import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | WsException | any, host: ArgumentsHost) {
    const logger = new Logger('GlobalExceptionFilter');

    if (exception instanceof JsonWebTokenError) {
      const response = host.switchToHttp().getResponse<Response>();
      const request = host.switchToHttp().getRequest<Request>();

      const status = HttpStatus.UNAUTHORIZED;
      const message = exception.message;

      logger.error(`Error ${status} ${message}`);
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof WsException) {
      Logger.error(exception);
      const client = host.switchToWs().getClient();
      client.emit('ErrorEvent', {
        message: exception.message,
      });
    } else if (exception instanceof BadRequestException) {
      Logger.error("BadRequestError: ", exception);
      const response = host.switchToHttp().getResponse<Response>();
      const request = host.switchToHttp().getRequest<Request>();
      const status = exception.getStatus() || HttpStatus.CONFLICT;
      const message = exception.getResponse();
      logger.error(`Error ${status}`);
      logger.error(message)
      response.status(status).json({
        statusCode: status,
        details: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof HttpException) {
      Logger.error("HttpError: ", exception);
      const response = host.switchToHttp().getResponse<Response>();
      const request = host.switchToHttp().getRequest<Request>();
      const status = exception.getStatus() || HttpStatus.CONFLICT;
      const message = exception.message;
      logger.error(`Error ${status} ${message}`);
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const response = host.switchToHttp().getResponse<Response>();
      const request = host.switchToHttp().getRequest<Request>();

      const status = HttpStatus.FAILED_DEPENDENCY;
      const message = exception.meta
      logger.error(`PrismaClientKnownRequestError : ${status} `);
      logger.error('Error Message:', message.details)
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError){
      const response = host.switchToHttp().getResponse<Response>();
      const request = host.switchToHttp().getRequest<Request>();

      const status = HttpStatus.FAILED_DEPENDENCY;
      const message = exception;
      logger.error(`PrismaClientUnknownRequestError :  ${status}`);
      logger.error('Error Message:', message)
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }else {
      const response = host.switchToHttp().getResponse<Response>();
      const request = host.switchToHttp().getRequest<Request>();

      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Internal server error';

      logger.error(`Error ${status} ${message}`);
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
