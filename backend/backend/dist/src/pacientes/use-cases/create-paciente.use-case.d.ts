import { Repository } from "typeorm";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { Paciente } from "../entities/paciente.entity";
import { TransactionService } from "../../common/services/transaction.service";
export declare class CreatePacienteUseCase {
    private pacienteRepo;
    private transactionService;
    constructor(pacienteRepo: Repository<Paciente>, transactionService: TransactionService);
    execute(input: CreatePacienteDto): Promise<Paciente>;
}
