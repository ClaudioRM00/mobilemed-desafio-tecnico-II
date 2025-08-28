import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePacienteUseCase } from './create-paciente.use-case';
import { Paciente, Sexo, Status } from '../entities/paciente.entity';
import { ConflictException } from '@nestjs/common';
import { TransactionService } from '../../common/services/transaction.service';

describe('CreatePacienteUseCase', () => {
  let useCase: CreatePacienteUseCase;
  let pacienteRepository: any;
  let transactionService: any;

  const mockCreatePacienteDto = {
    nome: 'João Silva',
    email: 'joao@email.com',
    data_nascimento: '1990-01-01',
    telefone: '(11) 99999-9999',
    endereco: 'Rua A, 123',
    documento_cpf: '123.456.789-00',
    sexo: Sexo.Masculino,
  };

  const mockPaciente = new Paciente({
    ...mockCreatePacienteDto,
    data_nascimento: new Date('1990-01-01'),
    status: Status.Ativo,
  });

  const mockQueryRunner = {
    manager: {
      findOne: jest.fn(),
      save: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePacienteUseCase,
        {
          provide: getRepositoryToken(Paciente),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: TransactionService,
          useValue: {
            executeInTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreatePacienteUseCase>(CreatePacienteUseCase);
    pacienteRepository = module.get<Repository<Paciente>>(getRepositoryToken(Paciente));
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a patient successfully', async () => {
      transactionService.executeInTransaction.mockImplementation(async (callback) => {
        mockQueryRunner.manager.findOne.mockResolvedValue(null); // No existing patient with CPF
        mockQueryRunner.manager.save.mockResolvedValue(mockPaciente);
        return callback(mockQueryRunner);
      });

      const result = await useCase.execute(mockCreatePacienteDto);

      expect(result).toEqual(mockPaciente);
      expect(result.status).toBe(Status.Ativo);
      expect(transactionService.executeInTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Paciente, {
        where: { documento_cpf: mockCreatePacienteDto.documento_cpf },
      });
    });

    it('should throw ConflictException when CPF already exists', async () => {
      transactionService.executeInTransaction.mockImplementation(async (callback) => {
        mockQueryRunner.manager.findOne.mockResolvedValue(mockPaciente); // Existing patient with CPF
        return callback(mockQueryRunner);
      });

      await expect(useCase.execute(mockCreatePacienteDto)).rejects.toThrow(ConflictException);
      expect(transactionService.executeInTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Paciente, {
        where: { documento_cpf: mockCreatePacienteDto.documento_cpf },
      });
    });

    it('should handle transaction errors during creation', async () => {
      transactionService.executeInTransaction.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(mockCreatePacienteDto)).rejects.toThrow('Database error');
    });

    it('should set default status as Ativo', async () => {
      const createDtoWithoutStatus = {
        ...mockCreatePacienteDto,
        status: undefined,
      };

      transactionService.executeInTransaction.mockImplementation(async (callback) => {
        mockQueryRunner.manager.findOne.mockResolvedValue(null);
        mockQueryRunner.manager.save.mockResolvedValue(mockPaciente);
        return callback(mockQueryRunner);
      });

      const result = await useCase.execute(createDtoWithoutStatus);

      expect(result.status).toBe(Status.Ativo);
    });

    it('should allow custom status', async () => {
      const createDtoWithStatus = {
        ...mockCreatePacienteDto,
        status: Status.Inativo,
      };

      const pacienteWithStatus = new Paciente({
        ...createDtoWithStatus,
        data_nascimento: new Date('1990-01-01'),
      });

      transactionService.executeInTransaction.mockImplementation(async (callback) => {
        mockQueryRunner.manager.findOne.mockResolvedValue(null);
        mockQueryRunner.manager.save.mockResolvedValue(pacienteWithStatus);
        return callback(mockQueryRunner);
      });

      const result = await useCase.execute(createDtoWithStatus);

      expect(result.status).toBe(Status.Inativo);
    });
  });
});
