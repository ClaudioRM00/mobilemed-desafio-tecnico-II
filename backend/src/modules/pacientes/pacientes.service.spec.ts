import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacientesService } from './pacientes.service';
import { Paciente, Status, Sexo } from './entities/paciente.entity';
import { CreatePacienteUseCase } from './use-cases/create-paciente.use-case';
import { UpdatePacienteUseCase } from './use-cases/update-paciente.use-case';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

describe('PacientesService', () => {
  let service: PacientesService;
  let mockRepository: any;
  let mockCreatePacienteUseCase: any;
  let mockUpdatePacienteUseCase: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockCreatePacienteUseCase = {
      execute: jest.fn(),
    };

    mockUpdatePacienteUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        {
          provide: getRepositoryToken(Paciente),
          useValue: mockRepository,
        },
        {
          provide: CreatePacienteUseCase,
          useValue: mockCreatePacienteUseCase,
        },
        {
          provide: UpdatePacienteUseCase,
          useValue: mockUpdatePacienteUseCase,
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
          telefone: '11999999999',
          endereco: 'Rua A, 123',
          documento_cpf: '12345678901',
          sexo: Sexo.Masculino,
          status: Status.Ativo,
        }),
      ];

      const mockQueryBuilder: any = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        // @ts-ignore: Mocking query builder for test purposes
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
      const mockPacientes = [
        new Paciente({
          nome: 'Maria Santos',
          email: 'maria@email.com',
          data_nascimento: new Date('1985-05-15'),
          telefone: '11888888888',
          endereco: 'Rua B, 456',
          documento_cpf: '98765432100',
          sexo: Sexo.Feminino,
          status: Status.Ativo,
        }),
      ];

      const mockQueryBuilder: any = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        // @ts-ignore: Mocking query builder for test purposes
        getManyAndCount: jest.fn().mockResolvedValue([mockPacientes, 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(2, 5);

      expect(result.data).toEqual(mockPacientes);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(2);
      expect(result.meta.pageSize).toBe(5);
    });
  });

  describe('findOne', () => {
    it('should return a patient by id', async () => {
      const mockPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        documento_cpf: '12345678901',
        sexo: Sexo.Masculino,
        status: Status.Ativo,
      });

      mockRepository.findOne.mockResolvedValue(mockPaciente);

      const result = await service.findOne('patient-uuid');

      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'patient-uuid' },
      });
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Paciente não encontrado',
      );
    });
  });

  describe('findByCpf', () => {
    it('should return a patient by CPF', async () => {
      const mockPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        documento_cpf: '12345678901',
        sexo: Sexo.Masculino,
        status: Status.Ativo,
      });

      mockRepository.findOne.mockResolvedValue(mockPaciente);

      const result = await service.findByCpf('12345678901');

      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { documento_cpf: '12345678901' },
      });
    });

    it('should return null when CPF not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCpf('99999999999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should delegate to CreatePacienteUseCase', async () => {
      const createPacienteDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        documento_cpf: '12345678901',
        sexo: Sexo.Masculino,
        status: Status.Ativo,
      };

      const mockPaciente = new Paciente(createPacienteDto);
      mockCreatePacienteUseCase.execute.mockResolvedValue(mockPaciente);

      const result = await service.create(createPacienteDto);

      expect(result).toEqual(mockPaciente);
      expect(mockCreatePacienteUseCase.execute).toHaveBeenCalledWith(createPacienteDto);
    });
  });

  describe('update', () => {
    it('should delegate to UpdatePacienteUseCase', async () => {
      const updatePacienteDto = {
        nome: 'João Silva Atualizado',
        email: 'joao.novo@email.com',
      };

      const mockPaciente = new Paciente({
        nome: 'João Silva Atualizado',
        email: 'joao.novo@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        documento_cpf: '12345678901',
        sexo: Sexo.Masculino,
        status: Status.Ativo,
      });

      mockUpdatePacienteUseCase.execute.mockResolvedValue(mockPaciente);

      const result = await service.update('patient-uuid', updatePacienteDto);

      expect(result).toEqual(mockPaciente);
      expect(mockUpdatePacienteUseCase.execute).toHaveBeenCalledWith('patient-uuid', updatePacienteDto);
    });
  });

  describe('remove', () => {
    it('should remove a patient successfully', async () => {
      const mockPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        documento_cpf: '12345678901',
        sexo: Sexo.Masculino,
        status: Status.Ativo,
      });

      mockRepository.findOne.mockResolvedValue(mockPaciente);
      mockRepository.remove.mockResolvedValue(mockPaciente);

      await service.remove('patient-uuid');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'patient-uuid' },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockPaciente);
    });

    it('should throw NotFoundException when patient not found during removal', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        'Paciente não encontrado',
      );
    });
  });
});
