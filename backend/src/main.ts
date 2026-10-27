import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// ANSI Color Utilities for Terminal
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  gold: '\x1b[38;2;229;193;88m',
  emerald: '\x1b[38;2;52;211;153m',
  cyan: '\x1b[38;2;56;189;248m',
  purple: '\x1b[38;2;192;132;252m',
  amber: '\x1b[38;2;251;146;60m',
  rose: '\x1b[38;2;244;63;94m',
  gray: '\x1b[90m',
  white: '\x1b[97m',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Colorful Request Logger Middleware
  app.use((req: any, res: any, next: any) => {
    const start = Date.now();
    const { method, originalUrl } = req;
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;
      
      let methodColor = c.emerald;
      if (method === 'POST') methodColor = c.cyan;
      if (method === 'PUT' || method === 'PATCH') methodColor = c.amber;
      if (method === 'DELETE') methodColor = c.rose;

      let statusColor = c.emerald;
      if (statusCode >= 300 && statusCode < 400) statusColor = c.cyan;
      if (statusCode >= 400 && statusCode < 500) statusColor = c.amber;
      if (statusCode >= 500) statusColor = c.rose;

      const time = new Date().toLocaleTimeString();
      console.log(
        `${c.gray}[${time}]${c.reset} ${methodColor}${c.bold}${method.padEnd(6)}${c.reset} ${c.white}${originalUrl.padEnd(28)}${c.reset} ${statusColor}${c.bold}${statusCode}${c.reset} ${c.gray}in${c.reset} ${c.gold}${duration}ms${c.reset}`
      );
    });

    next();
  });

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

  // Colorful Terminal Startup Banner
  console.log(`
${c.gold}${c.bold}╔══════════════════════════════════════════════════════════════════════╗
║   💎 ${c.white}ARANYAK JEWELLERS${c.gold} • HIGH JEWELLERY BACKEND ENGINE v1.0   ║
╚══════════════════════════════════════════════════════════════════════╝${c.reset}
  ${c.emerald}●${c.reset} ${c.bold}Server Status:${c.reset}     ${c.emerald}Online & Ready${c.reset}
  ${c.cyan}●${c.reset} ${c.bold}Local Endpoint:${c.reset}    ${c.cyan}http://localhost:${PORT}/api${c.reset}
  ${c.purple}●${c.reset} ${c.bold}Database:${c.reset}          ${c.purple}MongoDB Atlas (Connected)${c.reset}
  ${c.amber}●${c.reset} ${c.bold}CORS Allowed:${c.reset}      ${c.amber}${FRONTEND_URL}${c.reset}
  ${c.gold}●${c.reset} ${c.bold}Watch Mode:${c.reset}        ${c.gold}Active with Hot-Reload${c.reset}
${c.gray}────────────────────────────────────────────────────────────────────────${c.reset}
`);
}

bootstrap();
