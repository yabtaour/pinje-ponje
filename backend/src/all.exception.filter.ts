import { Catch, ArgumentsHost, BadRequestException, NotFoundException, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@Catch(WsException, HttpException, Error, BadRequestException, NotFoundException)

export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const logger = new Logger('AllExceptionsFilter');
    if (exception instanceof WsException) {
      logger.error(exception);
      super.catch(exception, host);

      client.emit('ErrorEvent', {
        message: exception.message,
      });

    } else if (exception instanceof BadRequestException) {
      logger.error(exception);
      client.emit('error', {
        message: 'Bad request. Please check your input data.',
      });
    } else if (exception instanceof NotFoundException) {
        logger.error(exception);
      client.emit('error', {
        message: 'Resource not found.',
      });
    } else {
        logger.error(exception);
      client.emit('error', {
        message: 'An error occurred.',
      });
    }
  }
}
