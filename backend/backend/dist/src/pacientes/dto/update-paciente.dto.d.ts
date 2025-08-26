import { Sexo, Status } from '../entities/paciente.entity';
declare class _UpdatePacienteDto {
    nome?: string | undefined;
    email?: string | undefined;
    data_nascimento?: Date | undefined;
    documento_cpf?: string | undefined;
    endereco?: string | undefined;
    sexo?: Sexo | undefined;
    telefone?: string | undefined;
    data_atualizacao?: Date | undefined;
    status?: Status | undefined;
}
declare const UpdatePacienteDto_base: import("@nestjs/mapped-types").MappedType<Partial<_UpdatePacienteDto>>;
export declare class UpdatePacienteDto extends UpdatePacienteDto_base {
}
export {};
