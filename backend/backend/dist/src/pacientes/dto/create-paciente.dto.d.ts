import { Sexo } from "../entities/paciente.entity";
export declare class CreatePacienteDto {
    nome: string;
    email: string;
    data_nascimento: Date;
    telefone: string;
    endereco: string;
    documento_cpf: string;
    sexo: Sexo;
}
