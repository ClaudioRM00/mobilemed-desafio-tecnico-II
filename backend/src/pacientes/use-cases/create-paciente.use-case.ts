import { Repository } from 'typeorm';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { Paciente, Status } from '../entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';
import { TransactionService } from '../../common/services/transaction.service';

@Injectable()
export class CreatePacienteUseCase {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepo: Repository<Paciente>,
    private transactionService: TransactionService,
  ) {}

  async execute(input: CreatePacienteDto) {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      // Verificar se já existe um paciente com o mesmo CPF
      const pacienteExistente = await queryRunner.manager.findOne(Paciente, {
        where: { documento_cpf: input.documento_cpf },
      });

      if (pacienteExistente) {
        throw new ConflictException(
          'Já existe um paciente cadastrado com este CPF',
        );
      }

      const paciente = new Paciente({
        ...input,
        data_nascimento: new Date(input.data_nascimento),
        status: input.status || Status.Ativo,
      });
      return queryRunner.manager.save(Paciente, paciente);
    });
  }
}
