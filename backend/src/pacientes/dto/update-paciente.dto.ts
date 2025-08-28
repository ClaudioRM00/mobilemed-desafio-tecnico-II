import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sexo, Status } from '../entities/paciente.entity';
import { CreatePacienteDto } from './create-paciente.dto';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
  @ApiProperty({
    description: 'Nome completo do paciente',
    example: 'João Silva Santos',
    required: false,
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    description: 'Email do paciente',
    example: 'joao.silva@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Data de nascimento do paciente (formato: YYYY-MM-DD)',
    example: '1990-05-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  data_nascimento?: string;

  @ApiProperty({
    description: 'Telefone do paciente (formato: (XX) XXXXX-XXXX)',
    example: '(11) 99999-9999',
    required: false,
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({
    description: 'Endereço completo do paciente',
    example: 'Rua das Flores, 123 - Centro - São Paulo/SP',
    required: false,
  })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiProperty({
    description: 'CPF do paciente (formato: XXX.XXX.XXX-XX)',
    example: '123.456.789-00',
    required: false,
  })
  @IsOptional()
  @IsString()
  documento_cpf?: string;

  @ApiProperty({
    description: 'Sexo do paciente',
    enum: Sexo,
    example: Sexo.Masculino,
    required: false,
  })
  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;

  @ApiProperty({
    description: 'Status do paciente',
    enum: Status,
    example: Status.Ativo,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
