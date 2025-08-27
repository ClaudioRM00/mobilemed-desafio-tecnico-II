import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { CreatePacienteUseCase } from './use-cases/create-paciente.use-case';
import { UpdatePacienteUseCase } from './use-cases/update-paciente.use-case';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('pacientes')
@Controller('pacientes')
export class PacientesController {
  constructor(
    private readonly pacientesService: PacientesService,
    private readonly createPacienteUseCase: CreatePacienteUseCase,
    private readonly updatePacienteUseCase: UpdatePacienteUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo paciente' })
  @ApiResponse({
    status: 201,
    description: 'Paciente criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou CPF já cadastrado',
  })
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.createPacienteUseCase.execute(createPacienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pacientes com paginação' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Tamanho da página',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes retornada com sucesso',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    // @Query('search') search?: string, // Removido temporariamente até implementar busca
  ) {
    return this.pacientesService.findAll(
      paginationDto.page,
      paginationDto.pageSize,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um paciente por ID' })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente' })
  @ApiResponse({
    status: 200,
    description: 'Paciente atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  update(
    @Param('id') id: string,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ) {
    console.log('UpdatePacienteDto received:', updatePacienteDto);
    return this.updatePacienteUseCase.execute(
      id,
      updatePacienteDto as Record<string, unknown>,
    );
  }
}
