import { Sexo } from "../entities/paciente.entity";
import { 
  IsString, 
  IsEmail, 
  IsDateString, 
  IsEnum, 
  IsNotEmpty, 
  Matches, 
  MinLength, 
  MaxLength 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePacienteDto {    
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @Transform(({ value }) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value + 'T00:00:00.000Z');
    }
    return value;
  })
  data_nascimento: Date;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/, { 
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX' 
  })
  telefone: string;

  @IsString()
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @MinLength(10, { message: 'Endereço deve ter pelo menos 10 caracteres' })
  @MaxLength(200, { message: 'Endereço deve ter no máximo 200 caracteres' })
  endereco: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { 
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX' 
  })
  documento_cpf: string;

  @IsEnum(Sexo, { message: 'Sexo deve ser Masculino, Feminino ou Outro' })
  @IsNotEmpty({ message: 'Sexo é obrigatório' })
  sexo: Sexo;
}
