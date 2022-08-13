import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: process.env.NG_APP_URL,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3000, () => Logger.log(`Server running on port ${3000}`, 'main.ts'));
}
bootstrap();
