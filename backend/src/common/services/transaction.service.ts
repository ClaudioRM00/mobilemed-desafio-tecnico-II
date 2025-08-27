import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Executa uma função dentro de uma transação ACID
   * @param operation Função a ser executada dentro da transação
   * @returns Resultado da operação
   */
  async executeInTransaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Iniciar transação
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Executar operação
      const result = await operation(queryRunner);

      // Commit da transação
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback em caso de erro
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar query runner
      await queryRunner.release();
    }
  }

  /**
   * Executa múltiplas operações em uma única transação
   * @param operations Array de operações a serem executadas
   * @returns Array com os resultados das operações
   */
  async executeMultipleInTransaction<T>(
    operations: ((queryRunner: QueryRunner) => Promise<T>)[],
  ): Promise<T[]> {
    return this.executeInTransaction(async (queryRunner) => {
      const results: T[] = [];

      for (const operation of operations) {
        const result = await operation(queryRunner);
        results.push(result);
      }

      return results;
    });
  }
}
