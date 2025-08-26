import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepo: Repository<Paciente>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<Paciente>> {
    const { page = 1, pageSize = 10 } = paginationDto;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.pacienteRepo.findAndCount({
      skip,
      take: pageSize,
      order: { data_cadastro: 'DESC' }, // Ordenar por data de cadastro mais recente
    });

    return new PaginatedResponseDto(data, page, pageSize, total);
  }

  findOne(id: string) {
    return this.pacienteRepo.findOneOrFail({where: {id}});
  }
}
