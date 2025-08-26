import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacientesService } from './pacientes.service';
import { Paciente, Sexo, Status } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PacientesService', () => {
  let service: PacientesService;
  let repository: Repository<Paciente>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
    repository = module.get<Repository<Paciente>>(getRepositoryToken(Paciente));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPacienteDto: CreatePacienteDto = {
      nome: 'João Silva',
      email: 'joao@email.com',
      data_nascimento: new Date('1990-01-01'),
      telefone: '(11) 99999-9999',
      endereco: 'Rua A, 123',
      documento_cpf: '123.456.789-00',
      sexo: Sexo.Masculino,
    };

    it('should create a patient with valid data and return UUID', async () => {
      const mockPaciente = new Paciente(createPacienteDto);
      mockRepository.create.mockReturnValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      const result = await service.create(createPacienteDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.nome).toBe(createPacienteDto.nome);
      expect(result.status).toBe(Status.Ativo);
      expect(mockRepository.create).toHaveBeenCalledWith(createPacienteDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPaciente);
    });

    it('should throw ConflictException when CPF already exists', async () => {
      mockRepository.create.mockReturnValue(new Paciente(createPacienteDto));
      mockRepository.save.mockRejectedValue(new Error('duplicate key value violates unique constraint'));

      await expect(service.create(createPacienteDto)).rejects.toThrow(ConflictException);
    });

    it('should handle database errors gracefully', async () => {
      mockRepository.create.mockReturnValue(new Paciente(createPacienteDto));
      mockRepository.save.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.create(createPacienteDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated list of patients', async () => {
      const mockPatients = [
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
        getManyAndCount: jest.fn().mockResolvedValue([mockPatients, 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockPatients);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
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
      expect(result.total).toBe(0);
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
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updatePacienteDto: UpdatePacienteDto = {
      nome: 'João Silva Atualizado',
      email: 'joao.atualizado@email.com',
    };

    it('should update a patient successfully', async () => {
      const existingPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });

      const updatedPaciente = { ...existingPaciente, ...updatePacienteDto };

      mockRepository.findOne.mockResolvedValue(existingPaciente);
      mockRepository.save.mockResolvedValue(updatedPaciente);

      const result = await service.update('test-id', updatePacienteDto);

      expect(result.nome).toBe(updatePacienteDto.nome);
      expect(result.email).toBe(updatePacienteDto.email);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent patient', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent-id', updatePacienteDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a patient successfully', async () => {
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
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('test-id');

      expect(mockRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when removing non-existent patient', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
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
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { documento_cpf: '123.456.789-00' } });
    });

    it('should return null when CPF not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCpf('999.999.999-99');

      expect(result).toBeNull();
    });
  });
});
