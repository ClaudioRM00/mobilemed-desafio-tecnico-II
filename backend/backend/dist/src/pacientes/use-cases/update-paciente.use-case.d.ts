import { Repository } from "typeorm";
import { Paciente } from "../entities/paciente.entity";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
export declare class UpdatePacienteUseCase {
    private pacienteRepo;
    constructor(pacienteRepo: Repository<Paciente>);
    update(id: string, input: UpdatePacienteDto): Promise<Paciente>;
}
