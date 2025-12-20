import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from '../logger/logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const logMessage =
      typeof message === 'object' && message !== null && 'message' in message
        ? (message as any).message
        : typeof message === 'string'
          ? message
          : 'Unknown error';

    this.logger.error(
      `Unhandled exception: ${logMessage} (status: ${status})`,
      {
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    );

    response.status(status).json({
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'Internal server error',
    });
  }
}
