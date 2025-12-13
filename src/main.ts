import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaErrorFilter } from './common/filters/prisma-error.filter';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { LoggingService } from './common/logger/logging.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggingService);

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new PrismaErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  process.on('uncaughtException', (err: Error) => {
    logger.error('Uncaught Exception', {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', {
      reason: String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const yamlPath = path.join(__dirname, '..', 'doc', 'api.yaml');
  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  const document = yaml.load(yamlContent) as OpenAPIObject;

  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Music Library API',
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
