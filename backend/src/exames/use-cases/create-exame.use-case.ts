import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exame, Modalidade } from '../entities/exame.entity';
import { PacientesService } from '../../pacientes/pacientes.service';

@Injectable()
export class CreateExameUseCase {
  constructor(
    @InjectRepository(Exame)
    private readonly exameRepository: Repository<Exame>,
    private readonly pacientesService: PacientesService,
  ) {}

  async execute(createExameDto: {
    idempotencyKey: string;
    id_paciente: string;
    modalidade: Modalidade;
    nome_exame: string;
    data_exame?: Date;
  }): Promise<Exame> {
    // Verificar se já existe um exame com a mesma idempotencyKey
    const existingExame = await this.exameRepository.findOne({
      where: { idempotencyKey: createExameDto.idempotencyKey },
    });

    if (existingExame) {
      return existingExame;
    }

    // Verificar se o paciente existe
    try {
      await this.pacientesService.findOne(createExameDto.id_paciente);
    } catch {
      throw new BadRequestException('Paciente não encontrado');
    }

    // Validar modalidade
    if (!Object.values(Modalidade).includes(createExameDto.modalidade)) {
      throw new BadRequestException('Modalidade inválida');
    }

    const exame = this.exameRepository.create(createExameDto);
    return await this.exameRepository.save(exame);
  }
}
