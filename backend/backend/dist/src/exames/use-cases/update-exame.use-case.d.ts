import { UpdateExameDto } from "../dto/update-exame.dto";
import { Exame } from "../entities/exame.entity";
import { Repository } from "typeorm";
export declare class UpdateExameUseCase {
    private exameRepo;
    constructor(exameRepo: Repository<Exame>);
    update(id: string, input: UpdateExameDto): Promise<Exame>;
}
