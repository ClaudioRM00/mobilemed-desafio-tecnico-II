import { Modalidade } from '../entities/exame.entity';
declare class _UpdateExameDto {
    nome_exame?: string;
    modalidade?: Modalidade;
    id_paciente?: string;
    data_exame?: Date;
}
declare const UpdateExameDto_base: import("@nestjs/mapped-types").MappedType<Partial<_UpdateExameDto>>;
export declare class UpdateExameDto extends UpdateExameDto_base {
}
export {};
