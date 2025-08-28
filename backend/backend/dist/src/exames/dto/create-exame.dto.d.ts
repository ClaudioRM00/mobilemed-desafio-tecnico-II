import { Modalidade } from "../entities/exame.entity";
export declare class CreateExameDto {
    nome_exame: string;
    modalidade: Modalidade;
    id_paciente: string;
    data_exame: Date;
    idempotencyKey: string;
}
