import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log(`[Aranyak Jewellers] Starting Backend v1.0...`);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || FRONTEND_URL === '*' || FRONTEND_URL.split(',').includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(PORT, '0.0.0.0');
  console.log(`✅ Aranyak Jewellers Backend running on: http://localhost:${PORT}`);
}

bootstrap();
