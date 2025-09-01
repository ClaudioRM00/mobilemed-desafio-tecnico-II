import { Repository } from 'typeorm';
import { Exame } from '../entities/exame.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteExameUseCase {
  constructor(
    @InjectRepository(Exame)
    private exameRepo: Repository<Exame>,
  ) {}

  async execute(id: string): Promise<void> {
    const exame = await this.exameRepo.findOne({ where: { id } });

    if (!exame) {
      throw new NotFoundException(`Exame com ID ${id} não encontrado`);
    }

    await this.exameRepo.remove(exame);
  }
}
