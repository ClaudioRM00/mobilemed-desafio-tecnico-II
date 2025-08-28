import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacientesService } from './pacientes.service';
import { Paciente, Sexo, Status } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PacientesService', () => {
  let service: PacientesService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        {
          provide: getRepositoryToken(Paciente),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of patients', async () => {
      const mockPacientes = [
        new Paciente({
          nome: 'João Silva',
          email: 'joao@email.com',
          data_nascimento: new Date('1990-01-01'),
          telefone: '(11) 99999-9999',
          endereco: 'Rua A, 123',
          documento_cpf: '123.456.789-00',
          sexo: Sexo.Masculino,
        }),
      ];

      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockPacientes, 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockPacientes);
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
    it('should return a patient by id', async () => {
      const mockPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });

      mockRepository.findOne.mockResolvedValue(mockPaciente);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCpf', () => {
    it('should find patient by CPF', async () => {
      const mockPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });

      mockRepository.findOne.mockResolvedValue(mockPaciente);

      const result = await service.findByCpf('123.456.789-00');

      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { documento_cpf: '123.456.789-00' },
      });
    });

    it('should return null when CPF not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCpf('non-existent-cpf');

      expect(result).toBeNull();
    });
  });
});
