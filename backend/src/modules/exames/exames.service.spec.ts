/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamesService } from './exames.service';
import { Exame, Modalidade } from './entities/exame.entity';
import { CreateExameUseCase } from './use-cases/create-exame.use-case';
import { UpdateExameUseCase } from './use-cases/update-exame.use-case';
import { DeleteExameUseCase } from './use-cases/delete-exame.use-case';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

describe('ExamesService', () => {
  let service: ExamesService;
  let mockRepository: any;
  let mockCreateExameUseCase: any;
  let mockUpdateExameUseCase: any;
  let mockDeleteExameUseCase: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
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
      providers: [
        ExamesService,
        {
          provide: getRepositoryToken(Exame),
          useValue: mockRepository,
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

    service = module.get<ExamesService>(ExamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of exams', async () => {
      const mockExams = [
        new Exame({
          nome_exame: 'Ressonância Magnética',
          modalidade: Modalidade.MR,
          id_paciente: 'patient-uuid',
          data_exame: new Date('2024-01-15'),
          idempotencyKey: 'unique-key-123',
        }),
      ];
      const mockQueryBuilder: any = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        // @ts-ignore: Mocking query builder for test purposes
        getManyAndCount: jest.fn().mockResolvedValue([mockExams, 1]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(1, 10);
      expect(result.data).toEqual(mockExams);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(10);
    });

    it('should handle empty results', async () => {
      const mockQueryBuilder: any = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        // @ts-ignore: Mocking query builder for test purposes
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(1, 10);
      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should handle different page and pageSize values', async () => {
      const mockExams = [
        new Exame({
          nome_exame: 'Tomografia',
          modalidade: Modalidade.CT,
          id_paciente: 'patient-uuid',
          data_exame: new Date('2024-01-15'),
          idempotencyKey: 'unique-key-456',
        }),
      ];
      const mockQueryBuilder: any = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        // @ts-ignore: Mocking query builder for test purposes
        getManyAndCount: jest.fn().mockResolvedValue([mockExams, 1]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(2, 5);
      expect(result.data).toEqual(mockExams);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(2);
      expect(result.meta.pageSize).toBe(5);
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

      mockRepository.findOne.mockResolvedValue(mockExame);

      const result = await service.findOne('exam-uuid');
      expect(result).toEqual(mockExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'exam-uuid' },
      });
    });

    it('should throw NotFoundException when exam not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Exame não encontrado',
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

      mockRepository.find.mockResolvedValue(mockExams);

      const result = await service.findByPatientId('patient-uuid');
      expect(result).toEqual(mockExams);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { id_paciente: 'patient-uuid' },
      });
    });

    it('should return empty array when no exams found for patient', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByPatientId('patient-uuid');
      expect(result).toEqual([]);
    });
  });

  describe('findByIdempotencyKey', () => {
    it('should return exam by idempotency key', async () => {
      const mockExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });

      mockRepository.findOne.mockResolvedValue(mockExame);

      const result = await service.findByIdempotencyKey('unique-key-123');
      expect(result).toEqual(mockExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'unique-key-123' },
      });
    });

    it('should return null when idempotency key not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByIdempotencyKey('non-existent-key');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should delegate to CreateExameUseCase', async () => {
      const createExameDto = {
        idempotencyKey: 'unique-key-123',
        id_paciente: 'patient-uuid',
        modalidade: Modalidade.MR,
        nome_exame: 'Ressonância Magnética',
        data_exame: new Date('2024-01-15'),
      };

      const mockExame = new Exame(createExameDto);
      mockCreateExameUseCase.execute.mockResolvedValue(mockExame);

      const result = await service.create(createExameDto);
      
      expect(result).toEqual(mockExame);
      expect(mockCreateExameUseCase.execute).toHaveBeenCalledWith(createExameDto);
    });
  });

  describe('update', () => {
    it('should delegate to UpdateExameUseCase', async () => {
      const updateExameDto = {
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

      const result = await service.update('exam-uuid', updateExameDto);
      
      expect(result).toEqual(mockExame);
      expect(mockUpdateExameUseCase.execute).toHaveBeenCalledWith('exam-uuid', updateExameDto);
    });
  });

  describe('remove', () => {
    it('should delegate to DeleteExameUseCase', async () => {
      mockDeleteExameUseCase.execute.mockResolvedValue(undefined);

      await service.remove('exam-uuid');
      
      expect(mockDeleteExameUseCase.execute).toHaveBeenCalledWith('exam-uuid');
    });
  });
});
