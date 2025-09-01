import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exame } from './entities/exame.entity';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';

@Injectable()
export class ExamesService {
  constructor(
    @InjectRepository(Exame)
    private readonly exameRepository: Repository<Exame>,
    private readonly createExameUseCase: CreateExameUseCase,
    private readonly updateExameUseCase: UpdateExameUseCase,
    private readonly deleteExameUseCase: DeleteExameUseCase,
  ) {}

  // Métodos genéricos de CRUD que não competem a uma intenção de usuário específica
  
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

  async findByPatientId(patientId: string): Promise<Exame[]> {
    return await this.exameRepository.find({
      where: { id_paciente: patientId },
    });
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Exame | null> {
    return await this.exameRepository.findOne({ where: { idempotencyKey } });
  }

  // Métodos que delegam para Use Cases específicos
  
  async create(createExameDto: {
    idempotencyKey?: string;
    id_paciente: string;
    modalidade: any;
    nome_exame: string;
    data_exame?: Date;
  }): Promise<Exame> {
    return this.createExameUseCase.execute(createExameDto);
  }

  async update(id: string, updateExameDto: Partial<Exame>): Promise<Exame> {
    return this.updateExameUseCase.execute(id, updateExameDto);
  }

  async remove(id: string): Promise<void> {
    return this.deleteExameUseCase.execute(id);
  }
}
