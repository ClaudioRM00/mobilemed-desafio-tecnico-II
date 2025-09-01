import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamesController } from './exames.controller';
import { ExamesService } from './exames.service';
import { Exame, Modalidade } from './entities/exame.entity';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ExamesController', () => {
  let controller: ExamesController;
  let mockExamesService: any;
  let mockCreateExameUseCase: any;
  let mockUpdateExameUseCase: any;
  let mockDeleteExameUseCase: any;

  beforeEach(async () => {
    mockExamesService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPatientId: jest.fn(),
    };

    mockCreateExameUseCase = {
      execute: jest.fn(),
    };

    mockUpdateExameUseCase = {
      execute: jest.fn(),
    };

    mockDeleteExameUseCase = {
      execute: jest.fn(),
    };

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
      expect(mockCreateExameUseCase.execute).toHaveBeenCalledWith(
        createExameDto,
      );
    });

    it('should throw BadRequestException when modalidade is invalid', async () => {
      const invalidDto = { ...createExameDto, modalidade: 'INVALID' as any };
      mockCreateExameUseCase.execute.mockRejectedValue(
        new BadRequestException('Modalidade inválida'),
      );

      await expect(controller.create(invalidDto)).rejects.toThrow(
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
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      mockExamesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({ page: 1, pageSize: 10 });

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockExamesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle default pagination parameters', async () => {
      const mockExams = [
        new Exame({
          nome_exame: 'Tomografia',
          modalidade: Modalidade.CT,
          id_paciente: 'patient-uuid',
          data_exame: new Date('2024-01-15'),
          idempotencyKey: 'unique-key-456',
        }),
      ];

      const mockPaginatedResponse = {
        data: mockExams,
        meta: {
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      mockExamesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({});

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockExamesService.findAll).toHaveBeenCalledWith(1, 10);
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

      const result = await controller.findOne('exam-uuid');

      expect(result).toEqual(mockExame);
      expect(mockExamesService.findOne).toHaveBeenCalledWith('exam-uuid');
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
      expect(mockExamesService.findByPatientId).toHaveBeenCalledWith('patient-uuid');
    });

    it('should return empty array when no exams found for patient', async () => {
      mockExamesService.findByPatientId.mockResolvedValue([]);

      const result = await controller.findByPatientId('patient-uuid');

      expect(result).toEqual([]);
      expect(mockExamesService.findByPatientId).toHaveBeenCalledWith('patient-uuid');
    });
  });

  describe('update', () => {
    it('should update an exam successfully', async () => {
      const updateExameDto: UpdateExameDto = {
        nome_exame: 'Tomografia Atualizada',
      };

      const mockExame = new Exame({
        nome_exame: 'Tomografia Atualizada',
        modalidade: Modalidade.CT,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });

      mockUpdateExameUseCase.execute.mockResolvedValue(mockExame);

      const result = await controller.update('exam-uuid', updateExameDto);

      expect(result).toEqual(mockExame);
      expect(mockUpdateExameUseCase.execute).toHaveBeenCalledWith(
        'exam-uuid',
        updateExameDto,
      );
    });

    it('should throw NotFoundException when updating non-existent exam', async () => {
      const updateExameDto: UpdateExameDto = {
        nome_exame: 'Tomografia Atualizada',
      };

      mockUpdateExameUseCase.execute.mockRejectedValue(
        new NotFoundException('Exame não encontrado'),
      );

      await expect(
        controller.update('non-existent-id', updateExameDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when data is invalid', async () => {
      const updateExameDto: UpdateExameDto = {
        nome_exame: '',
      };

      mockUpdateExameUseCase.execute.mockRejectedValue(
        new BadRequestException('Dados inválidos'),
      );

      await expect(
        controller.update('exam-uuid', updateExameDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an exam successfully', async () => {
      mockDeleteExameUseCase.execute.mockResolvedValue(undefined);

      await controller.remove('exam-uuid');

      expect(mockDeleteExameUseCase.execute).toHaveBeenCalledWith('exam-uuid');
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
});
