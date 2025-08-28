import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteExameUseCase } from './delete-exame.use-case';
import { Exame, Modalidade } from '../entities/exame.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteExameUseCase', () => {
  let useCase: DeleteExameUseCase;
  let exameRepository: jest.Mocked<Repository<Exame>>;

  const mockExame = new Exame({
    nome_exame: 'Ressonância Magnética',
    modalidade: Modalidade.MR,
    id_paciente: 'patient-uuid',
    data_exame: new Date('2024-01-15'),
    idempotencyKey: 'unique-key-123',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteExameUseCase,
        {
          provide: getRepositoryToken(Exame),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteExameUseCase>(DeleteExameUseCase);
    exameRepository = module.get<Repository<Exame>>(getRepositoryToken(Exame)) as jest.Mocked<Repository<Exame>>;
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete an exam successfully', async () => {
      exameRepository.findOne.mockResolvedValue(mockExame);
      exameRepository.remove.mockResolvedValue(mockExame);

      await useCase.execute('test-id');

      expect(exameRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(exameRepository.remove).toHaveBeenCalledWith(mockExame);
    });

    it('should throw NotFoundException when exam does not exist', async () => {
      exameRepository.findOne.mockResolvedValue(null);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(exameRepository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent-id' } });
      expect(exameRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle repository errors during deletion', async () => {
      exameRepository.findOne.mockResolvedValue(mockExame);
      exameRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute('test-id')).rejects.toThrow('Database error');
    });
  });
});
