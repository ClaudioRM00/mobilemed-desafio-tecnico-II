/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateExameUseCase } from './update-exame.use-case';
import { Exame, Modalidade } from '../entities/exame.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateExameUseCase', () => {
  let useCase: UpdateExameUseCase;
  let exameRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateExameUseCase,
        {
          provide: getRepositoryToken(Exame),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateExameUseCase>(UpdateExameUseCase);
    exameRepository = module.get<Repository<Exame>>(getRepositoryToken(Exame));
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update an exam successfully', async () => {
      const updateDto = {
        nome_exame: 'Tomografia Computadorizada',
        modalidade: Modalidade.CT,
      };
      const originalExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });
      const updatedExame = new Exame({ ...originalExame, ...updateDto });

      exameRepository.findOne.mockResolvedValue(originalExame);
      exameRepository.save.mockResolvedValue(updatedExame);

      const result = await useCase.execute('test-id', updateDto);

      expect(result).toBeInstanceOf(Exame);
      expect(result.nome_exame).toBe('Tomografia Computadorizada');
      expect(result.modalidade).toBe(Modalidade.CT);
      expect(exameRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(exameRepository.save).toHaveBeenCalledWith(expect.any(Exame));
    });

    it('should throw NotFoundException when exam does not exist', async () => {
      exameRepository.findOne.mockResolvedValue(null);

      await expect(useCase.execute('non-existent-id', {})).rejects.toThrow(
        NotFoundException,
      );
      expect(exameRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });

    it('should handle partial updates', async () => {
      const updateDto = {
        nome_exame: 'Tomografia Computadorizada',
      };
      const originalExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });
      const updatedExame = new Exame({
        ...originalExame,
        nome_exame: 'Tomografia Computadorizada',
        modalidade: Modalidade.MR,
      });

      exameRepository.findOne.mockResolvedValue(originalExame);
      exameRepository.save.mockResolvedValue(updatedExame);

      const result = await useCase.execute('test-id', updateDto);

      expect(result.nome_exame).toBe('Tomografia Computadorizada');
      expect(result.modalidade).toBe(Modalidade.MR); // Should remain unchanged
    });

    it('should convert date string to Date object when provided', async () => {
      const updateDto = {
        data_exame: '2024-02-15T10:00:00.000Z',
      };
      const originalExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });
      const updatedExame = new Exame({
        ...originalExame,
        data_exame: new Date('2024-02-15T10:00:00.000Z'),
      });

      exameRepository.findOne.mockResolvedValue(originalExame);
      exameRepository.save.mockResolvedValue(updatedExame);

      const result = await useCase.execute('test-id', updateDto);

      expect(result.data_exame).toEqual(new Date('2024-02-15T10:00:00.000Z'));
    });

    it('should handle service errors during update', async () => {
      const originalExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });
      exameRepository.findOne.mockResolvedValue(originalExame);
      exameRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        useCase.execute('test-id', { nome_exame: 'Test' }),
      ).rejects.toThrow('Database error');
    });

    it('should preserve existing fields when not provided in update', async () => {
      const updateDto = {
        nome_exame: 'Tomografia Computadorizada',
      };
      const originalExame = new Exame({
        nome_exame: 'Ressonância Magnética',
        modalidade: Modalidade.MR,
        id_paciente: 'patient-uuid',
        data_exame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
      });
      const updatedExame = new Exame({
        ...originalExame,
        nome_exame: 'Tomografia Computadorizada',
        modalidade: Modalidade.MR,
      });

      exameRepository.findOne.mockResolvedValue(originalExame);
      exameRepository.save.mockResolvedValue(updatedExame);

      const result = await useCase.execute('test-id', updateDto);

      expect(result.modalidade).toBe(Modalidade.MR);
      expect(result.id_paciente).toBe('patient-uuid');
      expect(result.data_exame).toEqual(new Date('2024-01-15'));
    });
  });
});
