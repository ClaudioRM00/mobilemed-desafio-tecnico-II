import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { CreatePacienteUseCase } from './use-cases/create-paciente.use-case';
import { UpdatePacienteUseCase } from './use-cases/update-paciente.use-case';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class PacientesController {
    private readonly pacientesService;
    private readonly createPacienteUseCase;
    private readonly updatePacienteUseCase;
    constructor(pacientesService: PacientesService, createPacienteUseCase: CreatePacienteUseCase, updatePacienteUseCase: UpdatePacienteUseCase);
    create(createPacienteDto: CreatePacienteDto): Promise<import("./entities/paciente.entity").Paciente>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<import("./entities/paciente.entity").Paciente>>;
    findOne(id: string): Promise<import("./entities/paciente.entity").Paciente>;
    update(id: string, updatePacienteDto: UpdatePacienteDto): Promise<import("./entities/paciente.entity").Paciente>;
}
