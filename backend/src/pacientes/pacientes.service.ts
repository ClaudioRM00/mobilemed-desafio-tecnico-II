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

  async findAll(paginationDto: PaginationDto, search?: string): Promise<PaginatedResponseDto<Paciente>> {
    const { page = 1, pageSize = 10 } = paginationDto;
    const skip = (page - 1) * pageSize;

    let query = this.pacienteRepo.createQueryBuilder('paciente');

    if (search) {
      query = query.where('paciente.nome ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .skip(skip)
      .take(pageSize)
      .orderBy('paciente.data_cadastro', 'DESC')
      .getManyAndCount();

    return new PaginatedResponseDto(data, page, pageSize, total);
  }

  findOne(id: string) {
    return this.pacienteRepo.findOneOrFail({where: {id}});
  }
}
