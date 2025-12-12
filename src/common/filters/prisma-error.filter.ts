import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception.code === 'P2002'
        ? HttpStatus.CONFLICT
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception.code === 'P2002'
        ? 'This value already exists'
        : 'Database error';

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === HttpStatus.NOT_FOUND) {
      const message = exception.message || 'Not Found';
      if (
        message.includes('not favorite') ||
        message.includes('not in favorites')
      ) {
        response.status(status).json({
          statusCode: status,
          message,
        });
        return;
      }
    }

    console.error(exception);
    response.status(status).json(exception.getResponse());
  }
}
