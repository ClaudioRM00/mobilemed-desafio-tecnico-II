import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamesService } from './exames.service';
import { Exame, Modalidade } from './entities/exame.entity';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { PacientesService } from '../pacientes/pacientes.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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

  describe('create', () => {
    const createExameDto: CreateExameDto = {
      nome_exame: 'Ressonância Magnética',
      modalidade: Modalidade.MR,
      id_paciente: 'patient-uuid',
      data_exame: new Date('2024-01-15'),
      idempotencyKey: 'unique-key-123',
    };

    const mockPaciente = {
      id: 'patient-uuid',
      nome: 'João Silva',
      email: 'joao@email.com',
    };

    it('should create an exam with existing patient and new idempotencyKey', async () => {
      const mockExame = new Exame(createExameDto);
      mockPacientesService.findOne.mockResolvedValue(mockPaciente);
      mockRepository.create.mockReturnValue(mockExame);
      mockRepository.save.mockResolvedValue(mockExame);

      const result = await service.create(createExameDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.nome_exame).toBe(createExameDto.nome_exame);
      expect(result.modalidade).toBe(createExameDto.modalidade);
      expect(result.id_paciente).toBe(createExameDto.id_paciente);
      expect(mockPacientesService.findOne).toHaveBeenCalledWith(createExameDto.id_paciente);
      expect(mockRepository.create).toHaveBeenCalledWith(createExameDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockExame);
    });

    it('should return existing exam when reusing same idempotencyKey', async () => {
      const existingExame = new Exame(createExameDto);
      mockRepository.findOne.mockResolvedValue(existingExame);

      const result = await service.create(createExameDto);

      expect(result).toEqual(existingExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { idempotencyKey: createExameDto.idempotencyKey } });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when patient does not exist', async () => {
      mockPacientesService.findOne.mockRejectedValue(new NotFoundException('Patient not found'));

      await expect(service.create(createExameDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockPacientesService.findOne.mockResolvedValue(mockPaciente);
      mockRepository.create.mockReturnValue(new Exame(createExameDto));
      mockRepository.save.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.create(createExameDto)).rejects.toThrow();
    });

    it('should validate modalidade enum', async () => {
      const invalidExameDto = {
        ...createExameDto,
        modalidade: 'INVALID' as Modalidade,
      };

      mockPacientesService.findOne.mockResolvedValue(mockPaciente);
      mockRepository.create.mockReturnValue(new Exame(invalidExameDto));
      mockRepository.save.mockRejectedValue(new Error('Invalid enum value'));

      await expect(service.create(invalidExameDto)).rejects.toThrow();
    });
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
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
    });

    it('should throw NotFoundException when exam not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateExameDto: UpdateExameDto = {
      nome_exame: 'Tomografia Computadorizada',
      modalidade: Modalidade.CT,
    };

    it('should update an exam successfully', async () => {
      const existingExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });

      const updatedExame = { ...existingExame, ...updateExameDto };

      mockRepository.findOne.mockResolvedValue(existingExame);
      mockRepository.save.mockResolvedValue(updatedExame);

      const result = await service.update('test-id', updateExameDto);

      expect(result.nome_exame).toBe(updateExameDto.nome_exame);
      expect(result.modalidade).toBe(updateExameDto.modalidade);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent exam', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent-id', updateExameDto)).rejects.toThrow(NotFoundException);
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

      expect(mockRepository.remove).toHaveBeenCalledWith(mockExame);
    });

    it('should throw NotFoundException when removing non-existent exam', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
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
      expect(mockRepository.find).toHaveBeenCalledWith({ where: { id_paciente: 'patient-uuid' } });
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
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { idempotencyKey: 'unique-key-123' } });
    });

    it('should return null when idempotency key not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByIdempotencyKey('non-existent-key');

      expect(result).toBeNull();
    });
  });
});
