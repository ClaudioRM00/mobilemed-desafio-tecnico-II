/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExameUseCase } from './create-exame.use-case';
import { PacientesService } from '../../pacientes/pacientes.service';
import { CreateExameDto } from '../dto/create-exame.dto';
import { Exame, Modalidade } from '../entities/exame.entity';
import { BadRequestException } from '@nestjs/common';

describe('CreateExameUseCase', () => {
  let useCase: CreateExameUseCase;
  let exameRepository: jest.Mocked<Repository<Exame>>;
  let pacientesService: jest.Mocked<PacientesService>;

  const mockCreateExameDto: CreateExameDto = {
    nome_exame: 'Ressonância Magnética',
    modalidade: Modalidade.MR,
    id_paciente: 'patient-uuid',
    data_exame: new Date('2024-01-15T10:30:00.000Z'),
    idempotencyKey: 'exame-123456789',
  };

  const mockExame = new Exame(
    {
      nome_exame: 'Ressonância Magnética',
      modalidade: Modalidade.MR,
      id_paciente: 'patient-uuid',
      data_exame: new Date('2024-01-15T10:30:00.000Z'),
      idempotencyKey: 'exame-123456789',
    },
    'exame-uuid',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateExameUseCase,
        {
          provide: getRepositoryToken(Exame),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: PacientesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateExameUseCase>(CreateExameUseCase);
    exameRepository = module.get(getRepositoryToken(Exame));
    pacientesService = module.get(PacientesService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new exam successfully', async () => {
      // Arrange
      exameRepository.findOne.mockResolvedValue(null);
      pacientesService.findOne.mockResolvedValue({ id: 'patient-uuid' } as any);
      exameRepository.create.mockReturnValue(mockExame);
      exameRepository.save.mockResolvedValue(mockExame);

      // Act
      const result = await useCase.execute(mockCreateExameDto);

      // Assert
      expect(result).toEqual(mockExame);
      expect(exameRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'exame-123456789' },
      });
      expect(pacientesService.findOne).toHaveBeenCalledWith('patient-uuid');
      expect(exameRepository.create).toHaveBeenCalledWith(mockCreateExameDto);
      expect(exameRepository.save).toHaveBeenCalledWith(mockExame);
    });

    it('should return existing exam if idempotency key already exists', async () => {
      // Arrange
      exameRepository.findOne.mockResolvedValue(mockExame);

      // Act
      const result = await useCase.execute(mockCreateExameDto);

      // Assert
      expect(result).toEqual(mockExame);
      expect(exameRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'exame-123456789' },
      });
      expect(pacientesService.findOne).not.toHaveBeenCalled();
      expect(exameRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when patient does not exist', async () => {
      // Arrange
      exameRepository.findOne.mockResolvedValue(null);
      pacientesService.findOne.mockRejectedValue(
        new Error('Patient not found'),
      );

      // Act & Assert
      await expect(useCase.execute(mockCreateExameDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(exameRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: 'exame-123456789' },
      });
      expect(pacientesService.findOne).toHaveBeenCalledWith('patient-uuid');
      expect(exameRepository.create).not.toHaveBeenCalled();
    });

    it('should handle service errors during creation', async () => {
      // Arrange
      exameRepository.findOne.mockResolvedValue(null);
      pacientesService.findOne.mockResolvedValue({ id: 'patient-uuid' } as any);
      exameRepository.create.mockReturnValue(mockExame);
      exameRepository.save.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(mockCreateExameDto)).rejects.toThrow(
        'Database error',
      );
    });

    it('should convert date string to Date object', async () => {
      // Arrange
      exameRepository.findOne.mockResolvedValue(null);
      pacientesService.findOne.mockResolvedValue({ id: 'patient-uuid' } as any);
      exameRepository.create.mockReturnValue(mockExame);
      exameRepository.save.mockResolvedValue(mockExame);

      // Act
      await useCase.execute(mockCreateExameDto);

      // Assert
      expect(exameRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data_exame: expect.any(Date),
        }),
      );
    });

    it('should validate modalidade', async () => {
      // Arrange
      const invalidDto = {
        ...mockCreateExameDto,
        modalidade: 'INVALID' as any,
      };
      exameRepository.findOne.mockResolvedValue(null);
      pacientesService.findOne.mockResolvedValue({ id: 'patient-uuid' } as any);

      // Act & Assert
      await expect(useCase.execute(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should generate idempotency key automatically when not provided', async () => {
      // Arrange
      const createExameDtoWithoutKey = {
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15T10:30:00.000Z'),
      };

      const expectedGeneratedKey = 'ressonância-magnética-';
      
      exameRepository.findOne.mockResolvedValue(null);
      pacientesService.findOne.mockResolvedValue({ id: 'patient-uuid' } as any);
      exameRepository.create.mockReturnValue(mockExame);
      exameRepository.save.mockResolvedValue(mockExame);

      // Act
      const result = await useCase.execute(createExameDtoWithoutKey);

      // Assert
      expect(result).toEqual(mockExame);
      expect(exameRepository.findOne).toHaveBeenCalledWith({
        where: { idempotencyKey: expect.stringMatching(new RegExp(`^${expectedGeneratedKey}\\d+$`)) },
      });
      expect(exameRepository.create).toHaveBeenCalledWith({
        ...createExameDtoWithoutKey,
        idempotencyKey: expect.stringMatching(new RegExp(`^${expectedGeneratedKey}\\d+$`)),
      });
    });
  });
});
