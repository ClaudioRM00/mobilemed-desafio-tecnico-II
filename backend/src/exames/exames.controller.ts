import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('exames')
@Controller('exames')
export class ExamesController {
  constructor(
    private readonly examesService: ExamesService,
    private readonly createExameUseCase: CreateExameUseCase,
    private readonly updateExameUseCase: UpdateExameUseCase,
    private readonly deleteExameUseCase: DeleteExameUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo exame' })
  @ApiResponse({
    status: 201,
    description: 'Exame criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou paciente não encontrado',
  })
  create(@Body() createExameDto: CreateExameDto) {
    return this.createExameUseCase.execute(createExameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os exames com paginação' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Tamanho da página',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames retornada com sucesso',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.examesService.findAll(
      paginationDto.page,
      paginationDto.pageSize,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um exame por ID' })
  @ApiParam({ name: 'id', description: 'ID do exame' })
  @ApiResponse({
    status: 200,
    description: 'Exame encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.examesService.findOne(id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Buscar exames por ID do paciente' })
  @ApiParam({ name: 'patientId', description: 'ID do paciente' })
  @ApiResponse({
    status: 200,
    description: 'Exames do paciente encontrados com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  findByPatientId(@Param('patientId') patientId: string) {
    return this.examesService.findByPatientId(patientId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um exame' })
  @ApiParam({ name: 'id', description: 'ID do exame' })
  @ApiResponse({
    status: 200,
    description: 'Exame atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  update(@Param('id') id: string, @Body() updateExameDto: UpdateExameDto) {
    return this.updateExameUseCase.execute(
      id,
      updateExameDto as Record<string, unknown>,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um exame' })
  @ApiParam({ name: 'id', description: 'ID do exame' })
  @ApiResponse({
    status: 200,
    description: 'Exame excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.deleteExameUseCase.execute(id);
  }
}
