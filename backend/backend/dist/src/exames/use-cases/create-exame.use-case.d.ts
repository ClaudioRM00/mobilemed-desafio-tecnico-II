import { Repository } from "typeorm";
import { CreateExameDto } from "../dto/create-exame.dto";
import { Exame } from "../entities/exame.entity";
import { Paciente } from "../../pacientes/entities/paciente.entity";
import { TransactionService } from "../../common/services/transaction.service";
export declare class CreateExameUseCase {
    private exameRepo;
    private pacienteRepo;
    private transactionService;
    constructor(exameRepo: Repository<Exame>, pacienteRepo: Repository<Paciente>, transactionService: TransactionService);
    execute(input: CreateExameDto): Promise<Exame>;
}
