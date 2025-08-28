import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let dataSource: DataSource;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as any;

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeInTransaction', () => {
    it('should execute operation successfully and commit transaction', async () => {
      const mockOperation = jest.fn().mockResolvedValue('test result');

      const result = await service.executeInTransaction(mockOperation);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockOperation).toHaveBeenCalledWith(mockQueryRunner);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result).toBe('test result');
    });

    it('should rollback transaction on error', async () => {
      const mockError = new Error('Test error');
      const mockOperation = jest.fn().mockRejectedValue(mockError);

      await expect(service.executeInTransaction(mockOperation)).rejects.toThrow('Test error');

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockOperation).toHaveBeenCalledWith(mockQueryRunner);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should release query runner even if release fails', async () => {
      const mockOperation = jest.fn().mockResolvedValue('test result');
      mockQueryRunner.release.mockRejectedValue(new Error('Release error'));

      await expect(service.executeInTransaction(mockOperation)).rejects.toThrow('Release error');

      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('executeMultipleInTransaction', () => {
    it('should execute multiple operations successfully', async () => {
      const mockOperation1 = jest.fn().mockResolvedValue('result1');
      const mockOperation2 = jest.fn().mockResolvedValue('result2');
      const operations = [mockOperation1, mockOperation2];

      const results = await service.executeMultipleInTransaction(operations);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockOperation1).toHaveBeenCalledWith(mockQueryRunner);
      expect(mockOperation2).toHaveBeenCalledWith(mockQueryRunner);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(results).toEqual(['result1', 'result2']);
    });

    it('should rollback on error in any operation', async () => {
      const mockError = new Error('Operation error');
      const mockOperation1 = jest.fn().mockResolvedValue('result1');
      const mockOperation2 = jest.fn().mockRejectedValue(mockError);
      const operations = [mockOperation1, mockOperation2];

      await expect(service.executeMultipleInTransaction(operations)).rejects.toThrow('Operation error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should handle empty operations array', async () => {
      const results = await service.executeMultipleInTransaction([]);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(results).toEqual([]);
    });
  });
});
