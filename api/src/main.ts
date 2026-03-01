import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Read cookies from requests
  app.use(cookieParser());

  // Auto-validate DTOs using class-validator decorators
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Prefix all routes with /api
  app.setGlobalPrefix('api');

  // Allow requests from the React app
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // needed for httpOnly cookies
  });

  await app.listen(3000);
  console.log('🍵 Oh My Matcha API running on http://localhost:3001/api');
}
bootstrap();