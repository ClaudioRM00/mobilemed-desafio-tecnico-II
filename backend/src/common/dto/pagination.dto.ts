import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser maior ou igual a 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Tamanho da página deve ser um número inteiro' })
  @Min(1, { message: 'Tamanho da página deve ser maior ou igual a 1' })
  @Max(100, { message: 'Tamanho da página deve ser menor ou igual a 100' })
  pageSize?: number = 10;
}
