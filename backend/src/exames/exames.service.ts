import { Injectable } from '@nestjs/common';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { Repository } from 'typeorm';
import { Exame } from './entities/exame.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private exameRepo: Repository<Exame>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<Exame>> {
    const { page = 1, pageSize = 10 } = paginationDto;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.exameRepo.findAndCount({
      skip,
      take: pageSize,
      order: { data_cadastro: 'DESC' }, // Ordenar por data de cadastro mais recente
    });

    return new PaginatedResponseDto(data, page, pageSize, total);
  }

  findOne(id: string) {
    return this.exameRepo.findOneOrFail({where: {id}});
  }
}
