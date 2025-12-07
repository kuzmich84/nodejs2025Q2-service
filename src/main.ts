import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaErrorFilter } from './common/filters/prisma-error.filter';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as yaml from 'js-yaml';
// import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // const yamlPath = path.join(__dirname, '..', 'doc', 'api.yaml');
  // const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  // const document = yaml.load(yamlContent) as OpenAPIObject;

  // SwaggerModule.setup('doc', app, document, {
  //   swaggerOptions: {
  //     persistAuthorization: true,
  //   },
  //   customSiteTitle: 'Music Library API',
  // });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
