import { Repository } from "typeorm";
import { Exame } from "../entities/exame.entity";
export declare class DeleteExameUseCase {
    private exameRepo;
    constructor(exameRepo: Repository<Exame>);
    execute(id: string): Promise<{
        message: string;
    }>;
}
