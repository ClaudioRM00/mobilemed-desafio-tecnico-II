import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Modalidade } from '../entities/exame.entity';

class _UpdateExameDto {
  @ApiProperty({
    description: 'Nome do exame médico',
    example: 'Ressonância Magnética do Crânio',
    required: false,
  })
  nome_exame?: string;

  @ApiProperty({
    description: 'Modalidade do exame',
    enum: Modalidade,
    example: Modalidade.MR,
    required: false,
  })
  modalidade?: Modalidade;

  @ApiProperty({
    description: 'ID do paciente (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  id_paciente?: string;

  @ApiProperty({
    description: 'Data do exame',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  data_exame?: Date;
}

export class UpdateExameDto extends PartialType(_UpdateExameDto) {}
