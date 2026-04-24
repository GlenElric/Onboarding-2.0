import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${context || 'Nest'}] ${level}: ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'api.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  });

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Security & Scalability
  app.enableCors();

  const port = process.env.PORT || 3001;
<<<<<<< HEAD
  await app.listen(port, '127.0.0.1');
=======
  await app.listen(port);
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
