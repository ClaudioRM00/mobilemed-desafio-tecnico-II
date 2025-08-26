import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { CreatePacienteUseCase } from './use-cases/create-paciente.use-case';
import { UpdatePacienteUseCase } from './use-cases/update-paciente.use-case';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('pacientes')
export class PacientesController {
  constructor (
    private readonly pacientesService: PacientesService,
    private readonly createPacienteUseCase: CreatePacienteUseCase,
    private readonly updatePacienteUseCase: UpdatePacienteUseCase,
  ) {}

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.createPacienteUseCase.execute(createPacienteDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Query('search') search?: string) {
    return this.pacientesService.findAll(paginationDto, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    console.log('UpdatePacienteDto received:', updatePacienteDto);
    return this.updatePacienteUseCase.update(id, updatePacienteDto);
  }
}
