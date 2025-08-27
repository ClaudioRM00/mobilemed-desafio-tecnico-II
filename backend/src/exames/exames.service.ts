import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exame, Modalidade } from './entities/exame.entity';
import { PacientesService } from '../pacientes/pacientes.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private readonly exameRepository: Repository<Exame>,
    private readonly pacientesService: PacientesService,
  ) {}

  async create(createExameDto: any): Promise<Exame> {
    // Verificar se já existe um exame com a mesma idempotencyKey
    const existingExame = await this.findByIdempotencyKey(createExameDto.idempotencyKey);
    if (existingExame) {
      return existingExame;
    }

    // Verificar se o paciente existe
    try {
      await this.pacientesService.findOne(createExameDto.id_paciente);
    } catch (error) {
      throw new BadRequestException('Paciente não encontrado');
    }

    const exame = this.exameRepository.create(createExameDto);
    return await this.exameRepository.save(exame);
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponseDto<Exame>> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.exameRepository
      .createQueryBuilder('exame')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return new PaginatedResponseDto(data, page, limit, total);
  }

  async findOne(id: string): Promise<Exame> {
    const exame = await this.exameRepository.findOne({ where: { id } });
    if (!exame) {
      throw new NotFoundException('Exame não encontrado');
    }
    return exame;
  }

  async update(id: string, updateExameDto: any): Promise<Exame> {
    const exame = await this.findOne(id);
    Object.assign(exame, updateExameDto);
    return await this.exameRepository.save(exame);
  }

  async remove(id: string): Promise<void> {
    const exame = await this.findOne(id);
    await this.exameRepository.remove(exame);
  }

  async findByPatientId(patientId: string): Promise<Exame[]> {
    return await this.exameRepository.find({ where: { id_paciente: patientId } });
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Exame | null> {
    return await this.exameRepository.findOne({ where: { idempotencyKey } });
  }
}
