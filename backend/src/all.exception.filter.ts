import { Catch, ArgumentsHost, BadRequestException, NotFoundException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const logger = new Logger('AllExceptionsFilter');
    if (exception instanceof WsException) {
      // Handle WebSocket-specific exceptions
      logger.error(exception);
      super.catch(exception, host);

      // console.log(exception);
      client.emit('ErrorEvent', {
        message: exception.message,
      });

    } else if (exception instanceof BadRequestException) {
      logger.error(exception);
      // Handle bad request (DTO validation) errors
      client.emit('error', {
        message: 'Bad request. Please check your input data.',
      });
    } else if (exception instanceof NotFoundException) {
        logger.error(exception);
      // Handle not found errors (e.g., resource not found)
      client.emit('error', {
        message: 'Resource not found.',
      });
    } else {
        logger.error(exception);
      // Handle other exceptions
      client.emit('error', {
        message: 'An error occurred.',
      });
    }
  }
}
