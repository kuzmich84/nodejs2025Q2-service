// src/common/logger/logging.service.ts
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

interface LogMeta {
  [key: string]: unknown;
}

@Injectable()
export class LoggingService {
  private logger: winston.Logger;

  constructor() {
    const level = process.env.LOG_LEVEL || 'info';

    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: process.env.LOG_MAX_SIZE || '10k',
          maxFiles: process.env.LOG_MAX_FILES || '5',
        }),
      ],
    });
  }

  error(message: string, meta?: LogMeta): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta?: LogMeta): void {
    this.logger.info(message, meta);
  }

  debug(message: string, meta?: LogMeta): void {
    this.logger.debug(message, meta);
  }
}
