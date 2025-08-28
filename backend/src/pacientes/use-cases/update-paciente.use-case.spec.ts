import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePacienteUseCase } from './update-paciente.use-case';
import { Paciente, Sexo, Status } from '../entities/paciente.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdatePacienteUseCase', () => {
  let useCase: UpdatePacienteUseCase;
  let pacienteRepository: any;

  const mockPaciente = new Paciente({
    nome: 'João Silva',
    email: 'joao@email.com',
    data_nascimento: new Date('1990-01-01'),
    telefone: '(11) 99999-9999',
    endereco: 'Rua A, 123',
    documento_cpf: '123.456.789-00',
    sexo: Sexo.Masculino,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePacienteUseCase,
        {
          provide: getRepositoryToken(Paciente),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdatePacienteUseCase>(UpdatePacienteUseCase);
    pacienteRepository = module.get<Repository<Paciente>>(getRepositoryToken(Paciente));
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a patient successfully', async () => {
      const updateDto = {
        nome: 'João Silva Atualizado',
        email: 'joao.atualizado@email.com',
      };

      const updatedPaciente = new Paciente({ ...mockPaciente, ...updateDto });

      pacienteRepository.findOne.mockResolvedValue(mockPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);

      const result = await useCase.execute('test-id', updateDto);

      expect(result).toBeInstanceOf(Paciente);
      expect(result.nome).toBe('João Silva Atualizado');
      expect(result.email).toBe('joao.atualizado@email.com');
      expect(pacienteRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(pacienteRepository.save).toHaveBeenCalledWith(expect.any(Paciente));
    });

    it('should throw NotFoundException when patient does not exist', async () => {
      pacienteRepository.findOne.mockResolvedValue(null);

      await expect(useCase.execute('non-existent-id', {})).rejects.toThrow(NotFoundException);
      expect(pacienteRepository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent-id' } });
    });

    it('should handle partial updates', async () => {
      const updateDto = {
        nome: 'João Silva Atualizado',
      };

      // Sempre crie uma nova instância para cada teste
      const originalPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });
      const updatedPaciente = new Paciente({
        ...originalPaciente,
        nome: 'João Silva Atualizado',
        email: 'joao@email.com', // garantir que não muda
      });

      pacienteRepository.findOne.mockResolvedValue(originalPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);

      const result = await useCase.execute('test-id', updateDto);

      expect(result.nome).toBe('João Silva Atualizado');
      expect(result.email).toBe('joao@email.com'); // Should remain unchanged
    });

    it('should convert date string to Date object when provided', async () => {
      const updateDto = {
        data_nascimento: '1985-05-15',
      };

      const updatedPaciente = { ...mockPaciente, data_nascimento: new Date('1985-05-15') };

      pacienteRepository.findOne.mockResolvedValue(mockPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);

      const result = await useCase.execute('test-id', updateDto);

      expect(result.data_nascimento).toEqual(new Date('1985-05-15'));
    });

    it('should handle service errors during update', async () => {
      pacienteRepository.findOne.mockResolvedValue(mockPaciente);
      pacienteRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute('test-id', { nome: 'Test' })).rejects.toThrow('Database error');
    });

    it('should not check CPF if not provided in update', async () => {
      const updateDto = {
        nome: 'João Silva Atualizado',
      };

      const updatedPaciente = { ...mockPaciente, nome: 'João Silva Atualizado' };

      pacienteRepository.findOne.mockResolvedValue(mockPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);

      const result = await useCase.execute('test-id', updateDto);

      expect(result).toEqual(updatedPaciente);
      expect(pacienteRepository.findOne).toHaveBeenCalledTimes(1); // Only for the patient being updated
    });

    it('should update telefone', async () => {
      const updateDto = { telefone: '(11) 98888-8888' };
      const originalPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });
      const updatedPaciente = new Paciente({ ...originalPaciente, telefone: updateDto.telefone });
      pacienteRepository.findOne.mockResolvedValue(originalPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);
      const result = await useCase.execute('test-id', updateDto);
      expect(result.telefone).toBe(updateDto.telefone);
    });

    it('should update endereco', async () => {
      const updateDto = { endereco: 'Rua Nova, 456' };
      const originalPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });
      const updatedPaciente = new Paciente({ ...originalPaciente, endereco: updateDto.endereco });
      pacienteRepository.findOne.mockResolvedValue(originalPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);
      const result = await useCase.execute('test-id', updateDto);
      expect(result.endereco).toBe(updateDto.endereco);
    });

    it('should update documento_cpf', async () => {
      const updateDto = { documento_cpf: '987.654.321-00' };
      const originalPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });
      const updatedPaciente = new Paciente({ ...originalPaciente, documento_cpf: updateDto.documento_cpf });
      pacienteRepository.findOne.mockResolvedValue(originalPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);
      const result = await useCase.execute('test-id', updateDto);
      expect(result.documento_cpf).toBe(updateDto.documento_cpf);
    });

    it('should update sexo', async () => {
      const updateDto = { sexo: Sexo.Feminino };
      const originalPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      });
      const updatedPaciente = new Paciente({ ...originalPaciente, sexo: updateDto.sexo });
      pacienteRepository.findOne.mockResolvedValue(originalPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);
      const result = await useCase.execute('test-id', updateDto);
      expect(result.sexo).toBe(updateDto.sexo);
    });

    it('should update status', async () => {
      const updateDto = { status: Status.Inativo };
      const originalPaciente = new Paciente({
        nome: 'João Silva',
        email: 'joao@email.com',
        data_nascimento: new Date('1990-01-01'),
        telefone: '(11) 99999-9999',
        endereco: 'Rua A, 123',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
        status: Status.Ativo,
      });
      const updatedPaciente = new Paciente({ ...originalPaciente, status: updateDto.status });
      pacienteRepository.findOne.mockResolvedValue(originalPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);
      const result = await useCase.execute('test-id', updateDto);
      expect(result.status).toBe(updateDto.status);
    });
  });
});
