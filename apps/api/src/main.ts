import './sentry';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { ConfigService } from './infrastructure/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // bodyParser: false,
    bufferLogs: true,
  });

  app.set('query parser', 'extended');

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173',
  });

  app.useLogger(app.get(Logger));
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Club Social API')
    .addGlobalResponse({
      description: 'Internal server error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
    .setDescription('Club Social API description')
    .setVersion('1.0')
    .addTag('club-social')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const configService = app.get(ConfigService);

  await app.listen(configService.port);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to bootstrap the application', error);
  process.exit(1);
});
