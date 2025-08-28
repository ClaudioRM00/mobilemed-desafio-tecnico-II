import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePacienteUseCase } from './update-paciente.use-case';
import { Paciente, Sexo, Status } from '../entities/paciente.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

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

      const updatedPaciente = { ...mockPaciente, ...updateDto };

      pacienteRepository.findOne.mockResolvedValue(mockPaciente);
      pacienteRepository.save.mockResolvedValue(updatedPaciente);

      const result = await useCase.execute('test-id', updateDto);

      expect(result).toEqual(updatedPaciente);
      expect(pacienteRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(pacienteRepository.save).toHaveBeenCalledWith(updatedPaciente);
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

      const updatedPaciente = { ...mockPaciente, nome: 'João Silva Atualizado' };

      pacienteRepository.findOne.mockResolvedValue(mockPaciente);
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
  });
});
