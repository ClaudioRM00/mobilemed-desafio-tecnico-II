import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { CreatePacienteUseCase } from './use-cases/create-paciente.use-case';
import { UpdatePacienteUseCase } from './use-cases/update-paciente.use-case';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    private readonly createPacienteUseCase: CreatePacienteUseCase,
    private readonly updatePacienteUseCase: UpdatePacienteUseCase,
  ) {}

  // Métodos genéricos de CRUD que não competem a uma intenção de usuário específica
  
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

  async findByCpf(cpf: string): Promise<Paciente | null> {
    return await this.pacienteRepository.findOne({
      where: { documento_cpf: cpf },
    });
  }

  // Métodos que delegam para Use Cases específicos
  
  async create(createPacienteDto: any): Promise<Paciente> {
    return this.createPacienteUseCase.execute(createPacienteDto);
  }

  async update(
    id: string,
    updatePacienteDto: Record<string, unknown>,
  ): Promise<Paciente> {
    return this.updatePacienteUseCase.execute(id, updatePacienteDto);
  }

  async remove(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    await this.pacienteRepository.remove(paciente);
  }
}
