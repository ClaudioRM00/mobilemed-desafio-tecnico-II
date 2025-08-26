import { Sexo } from "../entities/paciente.entity";
import { 
  IsString, 
  IsEmail, 
  IsDateString, 
  IsEnum, 
  IsOptional, 
  Matches, 
  MinLength, 
  MaxLength 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePacienteDto {    
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  email?: string;

  @IsOptional()
  data_nascimento?: Date | string;

  @IsOptional()
  @IsString()
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/, { 
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX' 
  })
  telefone?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Endereço deve ter pelo menos 10 caracteres' })
  @MaxLength(200, { message: 'Endereço deve ter no máximo 200 caracteres' })
  endereco?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { 
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX' 
  })
  documento_cpf?: string;

  @IsOptional()
  @IsEnum(Sexo, { message: 'Sexo deve ser Masculino, Feminino ou Outro' })
  sexo?: Sexo;
}
    
