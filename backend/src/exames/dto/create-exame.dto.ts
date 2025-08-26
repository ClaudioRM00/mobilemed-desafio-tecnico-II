import { Modalidade } from "../entities/exame.entity";
import { 
  IsString, 
  IsEnum, 
  IsNotEmpty, 
  IsDateString, 
  IsUUID, 
  MinLength, 
  MaxLength 
} from 'class-validator';

export class CreateExameDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome do exame é obrigatório' })
  @MinLength(3, { message: 'Nome do exame deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome do exame deve ter no máximo 100 caracteres' })
  nome_exame: string;

  @IsEnum(Modalidade, { 
    message: 'Modalidade deve ser uma das seguintes: CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA' 
  })
  @IsNotEmpty({ message: 'Modalidade é obrigatória' })
  modalidade: Modalidade;

  @IsUUID('4', { message: 'ID do paciente deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do paciente é obrigatório' })
  id_paciente: string;

  @IsDateString({}, { message: 'Data do exame deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data do exame é obrigatória' })
  data_exame: Date;

  @IsString()
  @IsNotEmpty({ message: 'Chave de idempotência é obrigatória' })
  @MinLength(10, { message: 'Chave de idempotência deve ter pelo menos 10 caracteres' })
  @MaxLength(255, { message: 'Chave de idempotência deve ter no máximo 255 caracteres' })
  idempotencyKey: string;
}
