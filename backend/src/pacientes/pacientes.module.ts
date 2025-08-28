import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteUseCase } from './use-cases/create-paciente.use-case';
import { UpdatePacienteUseCase } from './use-cases/update-paciente.use-case';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente]),
    CommonModule, // Importar para ter acesso ao TransactionService
  ],
  controllers: [PacientesController],
  providers: [PacientesService, CreatePacienteUseCase, UpdatePacienteUseCase],
  exports: [PacientesService], // Exportar para que outros módulos possam usar
})
export class PacientesModule {}
