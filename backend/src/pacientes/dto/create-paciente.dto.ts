import { IsString, IsEmail, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Sexo } from '../entities/paciente.entity';

export class CreatePacienteDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsDateString()
  data_nascimento: string;

  @IsString()
  telefone: string;

  @IsString()
  endereco: string;

  @IsString()
  documento_cpf: string;

  @IsEnum(Sexo)
  sexo: Sexo;

  @IsOptional()
  @IsString()
  transform(): Record<string, unknown> {
    return {
      nome: this.nome,
      email: this.email,
      data_nascimento: new Date(this.data_nascimento),
      telefone: this.telefone,
      endereco: this.endereco,
      documento_cpf: this.documento_cpf,
      sexo: this.sexo,
    };
  }
}
