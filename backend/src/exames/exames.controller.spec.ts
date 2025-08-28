import { Test, TestingModule } from '@nestjs/testing';
import { ExamesController } from './exames.controller';
import { ExamesService } from './exames.service';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';
import { PacientesService } from '../pacientes/pacientes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exame, Modalidade } from './entities/exame.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ExamesController', () => {
  let controller: ExamesController;

  const mockExamesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByPatientId: jest.fn(),
    findByIdempotencyKey: jest.fn(),
  };

  const mockCreateExameUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateExameUseCase = {
    execute: jest.fn(),
  };

  const mockDeleteExameUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamesController],
      providers: [
        {
          provide: ExamesService,
          useValue: mockExamesService,
        },
        {
          provide: CreateExameUseCase,
          useValue: mockCreateExameUseCase,
        },
        {
          provide: UpdateExameUseCase,
          useValue: mockUpdateExameUseCase,
        },
        {
          provide: DeleteExameUseCase,
          useValue: mockDeleteExameUseCase,
        },
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createExameDto: CreateExameDto = {
      nome_exame: 'Ressonância Magnética',
      modalidade: Modalidade.MR,
      id_paciente: 'patient-uuid',
      data_exame: new Date('2024-01-15'),
      idempotencyKey: 'unique-key-123',
    };

    const mockExame = new Exame(createExameDto);

    it('should create an exam with valid data and return HTTP 201', async () => {
      mockCreateExameUseCase.execute.mockResolvedValue(mockExame);

      const result = await controller.create(createExameDto);

      expect(result).toEqual(mockExame);
      expect(mockCreateExameUseCase.execute).toHaveBeenCalledWith(
        createExameDto,
      );
    });

    it('should return existing exam when reusing same idempotencyKey (HTTP 200)', async () => {
      const existingExame = new Exame(createExameDto);
      mockCreateExameUseCase.execute.mockResolvedValue(existingExame);

      const result = await controller.create(createExameDto);

      expect(result).toEqual(existingExame);
      expect(mockCreateExameUseCase.execute).toHaveBeenCalledWith(
        createExameDto,
      );
    });

    it('should throw BadRequestException when patient does not exist', async () => {
      mockCreateExameUseCase.execute.mockRejectedValue(
        new BadRequestException('Paciente não encontrado'),
      );

      await expect(controller.create(createExameDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when modalidade is invalid', async () => {
      const invalidExameDto = {
        ...createExameDto,
        modalidade: 'INVALID' as Modalidade,
      };

      mockCreateExameUseCase.execute.mockRejectedValue(
        new BadRequestException('Modalidade inválida'),
      );

      await expect(controller.create(invalidExameDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated list of exams (10 per page)', async () => {
      const mockExams = [
        new Exame({
          nome_exame: 'Ressonância Magnética',
          modalidade: Modalidade.MR,
          id_paciente: 'patient-uuid',
          data_exame: new Date('2024-01-15'),
          idempotencyKey: 'unique-key-123',
        }),
      ];

      const mockPaginatedResponse = {
        data: mockExams,
        meta: {
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      };

      mockExamesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({ page: 1, pageSize: 10 });

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockExamesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle default pagination parameters', async () => {
      const mockPaginatedResponse = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        },
      };

      mockExamesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({});

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockExamesService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('should return an exam by id', async () => {
      const mockExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });

      mockExamesService.findOne.mockResolvedValue(mockExame);

      const result = await controller.findOne('test-id');

      expect(result).toEqual(mockExame);
      expect(mockExamesService.findOne).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when exam not found', async () => {
      mockExamesService.findOne.mockRejectedValue(
        new NotFoundException('Exame não encontrado'),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateExameDto: UpdateExameDto = {
      nome_exame: 'Tomografia Computadorizada',
      modalidade: Modalidade.CT,
    };

    it('should update an exam successfully', async () => {
      const updatedExame = new Exame({
        nome_exame: 'Tomografia Computadorizada',
        modalidade: Modalidade.CT,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });

      mockUpdateExameUseCase.execute.mockResolvedValue(updatedExame);

      const result = await controller.update('test-id', updateExameDto);

      expect(result).toEqual(updatedExame);
      expect(mockUpdateExameUseCase.execute).toHaveBeenCalledWith(
        'test-id',
        updateExameDto,
      );
    });

    it('should throw NotFoundException when updating non-existent exam', async () => {
      mockUpdateExameUseCase.execute.mockRejectedValue(
        new NotFoundException('Exame não encontrado'),
      );

      await expect(
        controller.update('non-existent-id', updateExameDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when data is invalid', async () => {
      const invalidUpdateDto = {
        modalidade: 'INVALID' as Modalidade,
      };

      mockUpdateExameUseCase.execute.mockRejectedValue(
        new BadRequestException('Dados inválidos'),
      );

      await expect(
        controller.update('test-id', invalidUpdateDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an exam successfully', async () => {
      mockDeleteExameUseCase.execute.mockResolvedValue(undefined);

      await controller.remove('test-id');

      expect(mockDeleteExameUseCase.execute).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when removing non-existent exam', async () => {
      mockDeleteExameUseCase.execute.mockRejectedValue(
        new NotFoundException('Exame não encontrado'),
      );

      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByPatientId', () => {
    it('should return exams for a specific patient', async () => {
      const mockExams = [
        new Exame({
          nome_exame: 'Ressonância Magnética',
          modalidade: Modalidade.MR,
          id_paciente: 'patient-uuid',
          data_exame: new Date('2024-01-15'),
          idempotencyKey: 'unique-key-123',
        }),
      ];

      mockExamesService.findByPatientId.mockResolvedValue(mockExams);

      const result = await controller.findByPatientId('patient-uuid');

      expect(result).toEqual(mockExams);
      expect(mockExamesService.findByPatientId).toHaveBeenCalledWith(
        'patient-uuid',
      );
    });

    it('should return empty array when no exams found for patient', async () => {
      mockExamesService.findByPatientId.mockResolvedValue([]);

      const result = await controller.findByPatientId('patient-uuid');

      expect(result).toEqual([]);
      expect(mockExamesService.findByPatientId).toHaveBeenCalledWith(
        'patient-uuid',
      );
    });
  });
});
