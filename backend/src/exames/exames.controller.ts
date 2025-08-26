import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('exames')
export class ExamesController {
  constructor(
    private readonly examesService: ExamesService,
    private readonly createExameUseCase: CreateExameUseCase,
    private readonly updateExameUseCase: UpdateExameUseCase,
    private readonly deleteExameUseCase: DeleteExameUseCase,
  ) {}

  @Post()
  create(@Body() createExameDto: CreateExameDto) {
    return this.createExameUseCase.execute(createExameDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.examesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExameDto: UpdateExameDto) {
    return this.updateExameUseCase.update(id, updateExameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteExameUseCase.execute(id);
  }
}
