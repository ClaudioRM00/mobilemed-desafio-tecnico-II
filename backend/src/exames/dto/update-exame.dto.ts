import { ApiProperty } from '@nestjs/swagger';
import { Modalidade } from '../entities/exame.entity';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateExameDto {
  @ApiProperty({
    description: 'Nome do exame médico',
    example: 'Ressonância Magnética do Crânio',
    required: false,
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Nome do exame deve ter pelo menos 3 caracteres' })
  @MaxLength(100, {
    message: 'Nome do exame deve ter no máximo 100 caracteres',
  })
  nome_exame?: string;

  @ApiProperty({
    description: 'Modalidade do exame',
    enum: Modalidade,
    example: Modalidade.MR,
    required: false,
  })
  @IsOptional()
  @IsEnum(Modalidade, {
    message:
      'Modalidade deve ser uma das seguintes: CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA',
  })
  modalidade?: Modalidade;

  @ApiProperty({
    description: 'ID do paciente (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do paciente deve ser um UUID válido' })
  id_paciente?: string;

  @ApiProperty({
    description: 'Data do exame',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data do exame deve ser uma data válida' })
  data_exame?: string;

  @ApiProperty({
    description: 'Chave de idempotência para evitar duplicação',
    example: 'exame-rm-cranio-2024-01-15-001',
    required: false,
    minLength: 10,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: 'Chave de idempotência deve ter pelo menos 10 caracteres',
  })
  @MaxLength(255, {
    message: 'Chave de idempotência deve ter no máximo 255 caracteres',
  })
  idempotencyKey?: string;
}
