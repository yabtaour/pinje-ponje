import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | WsException, host: ArgumentsHost) {
    Logger.error(exception);
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    if (exception instanceof WsException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }
    
    Logger.error(`Error ${status} ${message}`);
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}