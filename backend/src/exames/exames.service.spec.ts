import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamesService } from './exames.service';
import { Exame, Modalidade } from './entities/exame.entity';
import { PacientesService } from '../pacientes/pacientes.service';
import { NotFoundException } from '@nestjs/common';

describe('ExamesService', () => {
  let service: ExamesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  const mockPacientesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamesService,
        {
          provide: getRepositoryToken(Exame),
          useValue: mockRepository,
        },
        {
          provide: PacientesService,
          useValue: mockPacientesService,
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

      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
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
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
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

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });

    it('should throw NotFoundException when exam not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByPatientId', () => {
    it('should find exams by patient id', async () => {
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
    it('should find exam by idempotency key', async () => {
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
});
