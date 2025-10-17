import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permitir o Vite (http://localhost:5173) chamar a API (http://localhost:3000)
  app.enableCors({
    origin: ['http://localhost:5173','http://127.0.0.1:5173','http://localhost:5174','http://127.0.0.1:5174'],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false,
    maxAge: 86400,
  });

  await app.listen(3000);
}
bootstrap();
