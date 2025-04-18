import compression from 'compression';

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/exeption-filters/http-exception.filter';

declare const module: any;

async function bootstrap() {
  console.log('Starting bootstrap2:...');
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.API_PORT || 3020;
  const isProd = process.env.NODE_ENV === 'production';

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: '*'
    });
  }

  // Required for dto's so they can throw the error
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: isProd
    })
  );

  app.use(compression());

  const loggerInstance = app.get(Logger);
  app.useGlobalFilters(new HttpExceptionFilter(loggerInstance));

  console.log('process.env.NODE_ENV:', process.env.NODE_ENV, isProd);
  console.log('Workspace folder from launch.json vscode:', process.env.WORKSPACE_FOLDER);

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
