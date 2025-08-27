import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente, Sexo, Status } from './entities/paciente.entity';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  async create(createPacienteDto: any): Promise<Paciente> {
    try {
      const paciente = this.pacienteRepository.create(createPacienteDto);
      return await this.pacienteRepository.save(paciente);
    } catch (error) {
      if (error.message.includes('duplicate key value violates unique constraint')) {
        throw new ConflictException('CPF já cadastrado');
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedResponseDto<Paciente>> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.pacienteRepository
      .createQueryBuilder('paciente')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return new PaginatedResponseDto(data, page, limit, total);
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }
    return paciente;
  }

  async update(id: string, updatePacienteDto: any): Promise<Paciente> {
    const paciente = await this.findOne(id);
    Object.assign(paciente, updatePacienteDto);
    return await this.pacienteRepository.save(paciente);
  }

  async remove(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    await this.pacienteRepository.remove(paciente);
  }

  async findByCpf(cpf: string): Promise<Paciente | null> {
    return await this.pacienteRepository.findOne({ where: { documento_cpf: cpf } });
  }
}
