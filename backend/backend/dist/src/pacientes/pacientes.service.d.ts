import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
export declare class PacientesService {
    private pacienteRepo;
    constructor(pacienteRepo: Repository<Paciente>);
    findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<Paciente>>;
    findOne(id: string): Promise<Paciente>;
}
