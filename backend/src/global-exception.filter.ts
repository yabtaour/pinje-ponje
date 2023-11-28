import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import e, { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | WsException, host: ArgumentsHost) {
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
    }
  
    else if (exception instanceof WsException) {
      Logger.error(exception);
      const client = host.switchToWs().getClient();
      client.emit('ErrorEvent', {
        message: exception.message,
      });
    }

    else if (exception instanceof HttpException) {
      Logger.error(exception);
      const response = host.switchToHttp().getResponse<Response>();
      const request = host.switchToHttp().getRequest<Request>();

      const status = exception.getStatus();
      const message = exception.message;

      logger.error(`Error ${status} ${message}`);
      response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    else {
      Logger.error(exception);
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