import { PartialType } from '@nestjs/mapped-types';
import { Modalidade } from '../entities/exame.entity';

class _UpdateExameDto {
    nome_exame?: string;
    modalidade?: Modalidade;
    id_paciente?: string;
    data_exame?: Date;
}

export class UpdateExameDto extends PartialType(_UpdateExameDto) {}

    
