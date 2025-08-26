import { Module } from '@nestjs/common';
import { ExamesService } from './exames.service';
import { ExamesController } from './exames.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exame } from './entities/exame.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exame, Paciente]), // Adicionar Paciente para validação
    CommonModule, // Importar para ter acesso ao TransactionService
  ],
  controllers: [ExamesController],
  providers: [ExamesService, CreateExameUseCase, UpdateExameUseCase, DeleteExameUseCase],
})
export class ExamesModule {}
