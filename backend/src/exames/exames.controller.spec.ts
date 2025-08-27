import { Test, TestingModule } from '@nestjs/testing';
import { ExamesController } from './exames.controller';
import { ExamesService } from './exames.service';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';
import { PacientesService } from '../pacientes/pacientes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exame } from './entities/exame.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

describe('ExamesController', () => {
  let controller: ExamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamesController],
      providers: [
        ExamesService,
        CreateExameUseCase,
        UpdateExameUseCase,
        DeleteExameUseCase,
        PacientesService,
        {
          provide: getRepositoryToken(Exame),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Paciente),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExamesController>(ExamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
