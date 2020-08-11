import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as config from 'config';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const PORT: number = config.get('app.port');

  const app = await NestFactory.create(AppModule, {
    logger: [
      'error',
      'log',
      'warn',
      'verbose',
      process.env.NODE_ENV === 'dev' ? 'debug' : null,
    ],
  });
  const options = new DocumentBuilder().setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(PORT);

  logger.verbose(
    `>>> Start with CONFIG_ENV: ${process.env.NODE_CONFIG_ENV}, NODE_ENV: ${process.env.NODE_ENV}`,
  );
  logger.log(`>>> GraphQL playground http://localhost:${PORT}/graphql `);
  logger.log(`>>> Restful API swagger http://localhost:${PORT}/swagger`);
}
bootstrap();
