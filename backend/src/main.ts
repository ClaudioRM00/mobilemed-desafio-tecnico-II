import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PacientesModule } from './pacientes/pacientes.module';
import { ExamesModule } from './exames/exames.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração do Swagger
  // Configuração básica do Swagger
  try {
    console.log('🔧 Configurando Swagger...');
    const config = new DocumentBuilder()
      .setTitle('MobileMed API')
      .setDescription('API para gerenciamento de pacientes e exames médicos')
      .setVersion('1.0')
      .build();

    console.log('📄 Gerando documentação...');
    const document = SwaggerModule.createDocument(app, config);
    console.log('📚 Configurando rota do Swagger...');
    SwaggerModule.setup('swagger', app, document);
    console.log('✅ Swagger configurado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao configurar Swagger:', error);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/swagger`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});
