import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEmail, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Sexo } from '../entities/paciente.entity';
import { CreatePacienteDto } from './create-paciente.dto';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  data_nascimento?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  documento_cpf?: string;

  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;
}
    
