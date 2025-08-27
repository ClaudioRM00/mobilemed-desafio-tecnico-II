import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exame } from '../entities/exame.entity';

@Injectable()
export class UpdateExameUseCase {
  constructor(
    @InjectRepository(Exame)
    private readonly exameRepository: Repository<Exame>,
  ) {}

  async execute(id: string, updateExameDto: Record<string, unknown>): Promise<Exame> {
    const exame = await this.exameRepository.findOne({ where: { id } });
    
    if (!exame) {
      throw new NotFoundException('Exame não encontrado');
    }

    // Atualizar apenas os campos fornecidos
    if (updateExameDto.nome_exame !== undefined) {
      exame.nome_exame = updateExameDto.nome_exame as string;
    }
    
    if (updateExameDto.modalidade !== undefined) {
      exame.modalidade = updateExameDto.modalidade as any;
    }
    
    if (updateExameDto.data_exame !== undefined) {
      exame.data_exame = new Date(updateExameDto.data_exame as string);
    }

    return await this.exameRepository.save(exame);
  }
}