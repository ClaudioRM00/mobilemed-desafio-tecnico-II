import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { ExamesModule } from './modules/exames/exames.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    PacientesModule,
    ExamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
