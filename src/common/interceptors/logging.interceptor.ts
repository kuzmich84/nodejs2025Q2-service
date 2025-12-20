import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../logger/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, body } = request;

    this.logger.info(`Incoming request`, {
      method,
      url,
      query,
      body,
    });

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          this.logger.info(`Response`, {
            statusCode,
            duration: `${duration}ms`,
          });
        },
        error: (err) => {
          const duration = Date.now() - now;
          this.logger.error(`Request failed`, {
            error: err.message,
            duration: `${duration}ms`,
          });
        },
      }),
    );
  }
}
