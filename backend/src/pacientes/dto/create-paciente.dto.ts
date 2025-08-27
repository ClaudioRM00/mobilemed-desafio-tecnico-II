import {
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Sexo } from '../entities/paciente.entity';

export class CreatePacienteDto {
  @ApiProperty({
    description: 'Nome completo do paciente',
    example: 'João Silva Santos',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Email do paciente',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Data de nascimento do paciente (formato: YYYY-MM-DD)',
    example: '1990-05-15',
  })
  @IsDateString()
  data_nascimento: string;

  @ApiProperty({
    description: 'Telefone do paciente (formato: (XX) XXXXX-XXXX)',
    example: '(11) 99999-9999',
  })
  @IsString()
  telefone: string;

  @ApiProperty({
    description: 'Endereço completo do paciente',
    example: 'Rua das Flores, 123 - Centro - São Paulo/SP',
  })
  @IsString()
  endereco: string;

  @ApiProperty({
    description: 'CPF do paciente (formato: XXX.XXX.XXX-XX)',
    example: '123.456.789-00',
  })
  @IsString()
  documento_cpf: string;

  @ApiProperty({
    description: 'Sexo do paciente',
    enum: Sexo,
    example: Sexo.Masculino,
  })
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
