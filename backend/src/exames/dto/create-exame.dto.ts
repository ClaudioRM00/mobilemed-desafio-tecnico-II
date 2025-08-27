import { Modalidade } from '../entities/exame.entity';
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExameDto {
  @ApiProperty({
    description: 'Nome do exame médico',
    example: 'Ressonância Magnética do Crânio',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome do exame é obrigatório' })
  @MinLength(3, { message: 'Nome do exame deve ter pelo menos 3 caracteres' })
  @MaxLength(100, {
    message: 'Nome do exame deve ter no máximo 100 caracteres',
  })
  nome_exame: string;

  @ApiProperty({
    description: 'Modalidade do exame',
    enum: Modalidade,
    example: Modalidade.MR,
  })
  @IsEnum(Modalidade, {
    message:
      'Modalidade deve ser uma das seguintes: CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA',
  })
  @IsNotEmpty({ message: 'Modalidade é obrigatória' })
  modalidade: Modalidade;

  @ApiProperty({
    description: 'ID do paciente (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'ID do paciente deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do paciente é obrigatório' })
  id_paciente: string;

  @ApiProperty({
    description: 'Data do exame',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDateString({}, { message: 'Data do exame deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data do exame é obrigatória' })
  data_exame: Date;

  @ApiProperty({
    description: 'Chave de idempotência para evitar duplicação',
    example: 'exame-rm-cranio-2024-01-15-001',
    minLength: 10,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Chave de idempotência é obrigatória' })
  @MinLength(10, {
    message: 'Chave de idempotência deve ter pelo menos 10 caracteres',
  })
  @MaxLength(255, {
    message: 'Chave de idempotência deve ter no máximo 255 caracteres',
  })
  idempotencyKey: string;
}
