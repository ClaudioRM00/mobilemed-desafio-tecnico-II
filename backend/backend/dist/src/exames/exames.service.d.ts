import { Repository } from 'typeorm';
import { Exame } from './entities/exame.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
export declare class ExamesService {
    private exameRepo;
    constructor(exameRepo: Repository<Exame>);
    findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<Exame>>;
    findOne(id: string): Promise<Exame>;
}
