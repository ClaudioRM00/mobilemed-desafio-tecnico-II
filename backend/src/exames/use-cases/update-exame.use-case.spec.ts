import { Test, TestingModule } from '@nestjs/testing';
import { UpdateExameUseCase } from './update-exame.use-case';
import { ExamesService } from '../exames.service';
import { UpdateExameDto } from '../dto/update-exame.dto';
import { Exame, Modalidade } from '../entities/exame.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateExameUseCase', () => {
  let useCase: UpdateExameUseCase;
  let examesService: jest.Mocked<ExamesService>;

  const mockUpdateExameDto: UpdateExameDto = {
    nome_exame: 'Ressonância Magnética Atualizada',
    modalidade: Modalidade.CT,
    data_exame: '2024-01-16T10:30:00.000Z',
    idempotencyKey: 'exame-update-123456789',
  };

  const mockExame = new Exame({
    nome_exame: 'Ressonância Magnética',
    modalidade: Modalidade.MR,
    id_paciente: 'patient-uuid',
    data_exame: new Date('2024-01-15T10:30:00.000Z'),
    idempotencyKey: 'exame-123456789',
  }, 'exame-uuid');

  const mockUpdatedExame = new Exame({
    nome_exame: 'Ressonância Magnética Atualizada',
    modalidade: Modalidade.CT,
    id_paciente: 'patient-uuid',
    data_exame: new Date('2024-01-16T10:30:00.000Z'),
    idempotencyKey: 'exame-update-123456789',
  }, 'exame-uuid');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateExameUseCase,
        {
          provide: ExamesService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateExameUseCase>(UpdateExameUseCase);
    examesService = module.get<ExamesService>(ExamesService) as jest.Mocked<ExamesService>;
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update an exam successfully', async () => {
      // Arrange
      examesService.findOne.mockResolvedValue(mockExame);
      examesService.update.mockResolvedValue(mockUpdatedExame);

      // Act
      const result = await useCase.execute('exame-uuid', mockUpdateExameDto as any);

      // Assert
      expect(result).toEqual(mockUpdatedExame);
      expect(examesService.findOne).toHaveBeenCalledWith('exame-uuid');
      expect(examesService.update).toHaveBeenCalledWith('exame-uuid', expect.objectContaining({
        nome_exame: 'Ressonância Magnética Atualizada',
        modalidade: Modalidade.CT,
        data_exame: expect.any(Date),
        idempotencyKey: 'exame-update-123456789',
      }));
    });

    it('should throw NotFoundException when exam does not exist', async () => {
      // Arrange
      examesService.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('non-existent-uuid', mockUpdateExameDto as any)).rejects.toThrow(NotFoundException);
      expect(examesService.findOne).toHaveBeenCalledWith('non-existent-uuid');
      expect(examesService.update).not.toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      const updateDto = {
        nome_exame: 'Tomografia Computadorizada',
      };

      const updatedExame = { ...mockExame, nome_exame: 'Tomografia Computadorizada' };

      examesService.findOne.mockResolvedValue(mockExame);
      examesService.update.mockResolvedValue(updatedExame);

      const result = await useCase.execute('test-id', updateDto);

      expect(result.nome_exame).toBe('Tomografia Computadorizada');
      expect(result.modalidade).toBe(Modalidade.MR); // Should remain unchanged
    });

    it('should convert date string to Date object when provided', async () => {
      const updateDto = {
        data_exame: '2024-02-15T10:00:00.000Z',
      };

      const updatedExame = { ...mockExame, data_exame: new Date('2024-02-15T10:00:00.000Z') };

      examesService.findOne.mockResolvedValue(mockExame);
      examesService.update.mockResolvedValue(updatedExame);

      const result = await useCase.execute('test-id', updateDto);

      expect(result.data_exame).toEqual(new Date('2024-02-15T10:00:00.000Z'));
    });

    it('should handle service errors during update', async () => {
      examesService.findOne.mockResolvedValue(mockExame);
      examesService.update.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute('test-id', { nome_exame: 'Test' })).rejects.toThrow('Database error');
    });

    it('should preserve existing fields when not provided in update', async () => {
      const updateDto = {
        nome_exame: 'Tomografia Computadorizada',
      };

      const updatedExame = { ...mockExame, nome_exame: 'Tomografia Computadorizada' };

      examesService.findOne.mockResolvedValue(mockExame);
      examesService.update.mockResolvedValue(updatedExame);

      const result = await useCase.execute('test-id', updateDto);

      expect(result.modalidade).toBe(Modalidade.MR);
      expect(result.id_paciente).toBe('patient-uuid');
      expect(result.data_exame).toEqual(new Date('2024-01-15'));
    });
  });
});
