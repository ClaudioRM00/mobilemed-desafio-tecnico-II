import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ExamesController {
    private readonly examesService;
    private readonly createExameUseCase;
    private readonly updateExameUseCase;
    private readonly deleteExameUseCase;
    constructor(examesService: ExamesService, createExameUseCase: CreateExameUseCase, updateExameUseCase: UpdateExameUseCase, deleteExameUseCase: DeleteExameUseCase);
    create(createExameDto: CreateExameDto): Promise<import("./entities/exame.entity").Exame>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<import("./entities/exame.entity").Exame>>;
    findOne(id: string): Promise<import("./entities/exame.entity").Exame>;
    update(id: string, updateExameDto: UpdateExameDto): Promise<import("./entities/exame.entity").Exame>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
