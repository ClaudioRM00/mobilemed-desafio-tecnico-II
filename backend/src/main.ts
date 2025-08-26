import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Temporariamente desabilitado para debug
      forbidNonWhitelisted: false, // Temporariamente desabilitado para debug
      transform: true, // Transforma automaticamente tipos
      transformOptions: {
        enableImplicitConversion: true, // Permite conversão implícita de tipos
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
