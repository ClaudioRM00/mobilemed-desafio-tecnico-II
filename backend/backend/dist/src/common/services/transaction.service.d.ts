import { DataSource, QueryRunner } from 'typeorm';
export declare class TransactionService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    executeInTransaction<T>(operation: (queryRunner: QueryRunner) => Promise<T>): Promise<T>;
    executeMultipleInTransaction<T>(operations: ((queryRunner: QueryRunner) => Promise<T>)[]): Promise<T[]>;
}
