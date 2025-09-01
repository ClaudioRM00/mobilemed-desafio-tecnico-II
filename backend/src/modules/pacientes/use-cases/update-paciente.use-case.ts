import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente, Sexo, Status } from '../entities/paciente.entity';

@Injectable()
export class UpdatePacienteUseCase {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  async execute(
    id: string,
    updatePacienteDto: Record<string, unknown>,
  ): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });

    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Atualizar apenas os campos fornecidos
    if (updatePacienteDto.nome !== undefined) {
      paciente.nome = updatePacienteDto.nome as string;
    }

    if (updatePacienteDto.email !== undefined) {
      paciente.email = updatePacienteDto.email as string;
    }

    if (updatePacienteDto.data_nascimento !== undefined) {
      paciente.data_nascimento = new Date(
        updatePacienteDto.data_nascimento as string,
      );
    }

    if (updatePacienteDto.telefone !== undefined) {
      paciente.telefone = updatePacienteDto.telefone as string;
    }

    if (updatePacienteDto.endereco !== undefined) {
      paciente.endereco = updatePacienteDto.endereco as string;
    }

    if (updatePacienteDto.documento_cpf !== undefined) {
      paciente.documento_cpf = updatePacienteDto.documento_cpf as string;
    }

    if (updatePacienteDto.sexo !== undefined) {
      paciente.sexo = updatePacienteDto.sexo as Sexo;
    }

    if (updatePacienteDto.status !== undefined) {
      paciente.status = updatePacienteDto.status as Status;
    }

    paciente.data_atualizacao = new Date();
    return await this.pacienteRepository.save(paciente);
  }
}
