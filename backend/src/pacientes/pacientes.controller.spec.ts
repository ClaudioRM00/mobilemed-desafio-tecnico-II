import { Test, TestingModule } from '@nestjs/testing';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { CreatePacienteUseCase } from './use-cases/create-paciente.use-case';
import { UpdatePacienteUseCase } from './use-cases/update-paciente.use-case';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Paciente, Sexo, Status } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PacientesController', () => {
  let controller: PacientesController;
  let pacientesService: PacientesService;
  let createPacienteUseCase: CreatePacienteUseCase;
  let updatePacienteUseCase: UpdatePacienteUseCase;

  const mockPacientesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCpf: jest.fn(),
  };

  const mockCreatePacienteUseCase = {
    execute: jest.fn(),
  };

  const mockUpdatePacienteUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacientesController],
      providers: [
        {
          provide: PacientesService,
          useValue: mockPacientesService,
        },
        {
          provide: CreatePacienteUseCase,
          useValue: mockCreatePacienteUseCase,
        },
        {
          provide: UpdatePacienteUseCase,
          useValue: mockUpdatePacienteUseCase,
        },
        {
          provide: getRepositoryToken(Paciente),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PacientesController>(PacientesController);
    pacientesService = module.get<PacientesService>(PacientesService);
    createPacienteUseCase = module.get<CreatePacienteUseCase>(CreatePacienteUseCase);
    updatePacienteUseCase = module.get<UpdatePacienteUseCase>(UpdatePacienteUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPacienteDto: CreatePacienteDto = {
      nome: 'João Silva',
      email: 'joao@email.com',
      data_nascimento: '1990-01-01',
      telefone: '(11) 99999-9999',
      endereco: 'Rua A, 123',
      documento_cpf: '123.456.789-00',
      sexo: Sexo.Masculino,
    };

    const mockPaciente = new Paciente({
      ...createPacienteDto,
      data_nascimento: new Date(createPacienteDto.data_nascimento),
    });

    it('should create a patient with valid data and return UUID', async () => {
      mockCreatePacienteUseCase.execute.mockResolvedValue(mockPaciente);

      const result = await controller.create(createPacienteDto);

      expect(result).toEqual(mockPaciente);
      expect(result.id).toBeDefined();
      expect(result.nome).toBe(createPacienteDto.nome);
      expect(result.status).toBe(Status.Ativo);
      expect(mockCreatePacienteUseCase.execute).toHaveBeenCalledWith(createPacienteDto);
    });

    it('should throw ConflictException when CPF already exists', async () => {
      mockCreatePacienteUseCase.execute.mockRejectedValue(
        new ConflictException('CPF já cadastrado'),
      );

      await expect(controller.create(createPacienteDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle validation errors', async () => {
      const invalidPacienteDto = {
        ...createPacienteDto,
        email: 'invalid-email',
      };

      mockCreatePacienteUseCase.execute.mockRejectedValue(
        new Error('Validation failed'),
      );

      await expect(controller.create(invalidPacienteDto)).rejects.toThrow();
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

      const mockPaginatedResponse = {
        data: mockPatients,
        meta: {
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      };

      mockPacientesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({ page: 1, pageSize: 10 });

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockPacientesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle default pagination parameters', async () => {
      const mockPaginatedResponse = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        },
      };

      mockPacientesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll({});

      expect(result).toEqual(mockPaginatedResponse);
      expect(mockPacientesService.findAll).toHaveBeenCalledWith(undefined, undefined);
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

      mockPacientesService.findOne.mockResolvedValue(mockPaciente);

      const result = await controller.findOne('test-id');

      expect(result).toEqual(mockPaciente);
      expect(mockPacientesService.findOne).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockPacientesService.findOne.mockRejectedValue(
        new NotFoundException('Paciente não encontrado'),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updatePacienteDto: UpdatePacienteDto = {
      nome: 'João Silva Atualizado',
      email: 'joao.atualizado@email.com',
    };

    it('should update a patient successfully', async () => {
      const updatedPaciente = new Paciente({
        nome: 'João Silva Atualizado',
        email: 'joao.atualizado@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });

      mockUpdatePacienteUseCase.execute.mockResolvedValue(updatedPaciente);

      const result = await controller.update('test-id', updatePacienteDto);

      expect(result).toEqual(updatedPaciente);
      expect(result.nome).toBe(updatePacienteDto.nome);
      expect(result.email).toBe(updatePacienteDto.email);
      expect(mockUpdatePacienteUseCase.execute).toHaveBeenCalledWith(
        'test-id',
        updatePacienteDto,
      );
    });

    it('should throw NotFoundException when updating non-existent patient', async () => {
      mockUpdatePacienteUseCase.execute.mockRejectedValue(
        new NotFoundException('Paciente não encontrado'),
      );

      await expect(
        controller.update('non-existent-id', updatePacienteDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle validation errors during update', async () => {
      const invalidUpdateDto = {
        email: 'invalid-email',
      };

      mockUpdatePacienteUseCase.execute.mockRejectedValue(
        new Error('Validation failed'),
      );

      await expect(
        controller.update('test-id', invalidUpdateDto),
      ).rejects.toThrow();
    });
  });
});
