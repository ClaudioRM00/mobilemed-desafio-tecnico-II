import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamesService } from './exames.service';
import { Exame, Modalidade } from './entities/exame.entity';
import { PacientesService } from '../pacientes/pacientes.service';
import { NotFoundException } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('ExamesService', () => {
  let service: ExamesService;

  const mockRepository: any = {
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

  const mockPacientesService: any = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
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
      const mockQueryBuilder: any = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        // @ts-expect-error
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
        // @ts-expect-error
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
    it('should find an exam by idempotencyKey', async () => {
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

    it('should return null when exam not found by idempotencyKey', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByIdempotencyKey('non-existent-key');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'non-existent-key' },
      });
    });
  });

  describe('create', () => {
    it('should create a new exam successfully', async () => {
      const createExameDto = {
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      };

      const mockExame = new Exame(createExameDto);
      const mockPaciente = { id: 'patient-uuid' };

      mockRepository.create.mockReturnValue(mockExame);
      mockRepository.save.mockResolvedValue(mockExame);
      mockPacientesService.findOne.mockResolvedValue(mockPaciente as any);
      mockRepository.findOne.mockResolvedValue(null); // No existing exam with idempotencyKey

      const result = await service.create(createExameDto);

      expect(result).toEqual(mockExame);
      expect(mockRepository.create).toHaveBeenCalledWith(createExameDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockExame);
      expect(mockPacientesService.findOne).toHaveBeenCalledWith('patient-uuid');
    });

    it('should throw error when patient not found', async () => {
      const createExameDto = {
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'non-existent-patient',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      };

      mockPacientesService.findOne.mockRejectedValue(new Error('Paciente não encontrado'));
      mockRepository.findOne.mockResolvedValue(null); // garantir que não existe exame com idempotencyKey

      await expect(service.create(createExameDto)).rejects.toThrow('Paciente não encontrado');
      expect(mockPacientesService.findOne).toHaveBeenCalledWith('non-existent-patient');
    });

    it('should return existing exam when idempotencyKey already exists', async () => {
      const createExameDto = {
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'existing-key-123',
      };

      const existingExame = new Exame(createExameDto);
      const mockPaciente = { id: 'patient-uuid' };

      mockPacientesService.findOne.mockResolvedValue(mockPaciente as any);
      mockRepository.findOne.mockResolvedValue(existingExame);

      const result = await service.create(createExameDto);

      expect(result).toEqual(existingExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'existing-key-123' },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an exam successfully', async () => {
      const updateExameDto = {
        nome_exame: 'Tomografia Computadorizada',
        modalidade: Modalidade.CT,
      };

      const mockExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });

      const updatedExame = { ...mockExame, ...updateExameDto };

      mockRepository.findOne.mockResolvedValue(mockExame);
      mockRepository.save.mockResolvedValue(updatedExame);

      const result = await service.update('test-id', updateExameDto);

      expect(result).toEqual(updatedExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedExame);
    });

    it('should throw NotFoundException when exam not found during update', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent-id' } });
    });
  });

  describe('remove', () => {
    it('should remove an exam successfully', async () => {
      const mockExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });

      mockRepository.findOne.mockResolvedValue(mockExame);
      mockRepository.remove.mockResolvedValue(mockExame);

      await service.remove('test-id');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockExame);
    });

    it('should throw NotFoundException when exam not found during removal', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent-id' } });
    });
  });
});
