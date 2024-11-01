/**
 * @file Starts the backend server.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';

BigInt.prototype.toJSON = function () {
  return { $bigint: this.toString() };
};

// eslint-disable-next-line jsdoc/require-example
/**
 * Starts the backend server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['verbose'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Trail backend')
    .setDescription('The trails API description')
    .setVersion('1.0')
    .addTag('trail')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
