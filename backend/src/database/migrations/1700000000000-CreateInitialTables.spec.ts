import { QueryRunner, Table, TableIndex } from 'typeorm';
import { CreateInitialTables1700000000000 } from './1700000000000-CreateInitialTables';

describe('CreateInitialTables1700000000000', () => {
  let migration: CreateInitialTables1700000000000;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(() => {
    migration = new CreateInitialTables1700000000000();
    mockQueryRunner = {
      createTable: jest.fn(),
      createIndex: jest.fn(),
      query: jest.fn(),
      dropTable: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('up', () => {
    it('should create paciente table with correct structure', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'paciente',
          columns: expect.arrayContaining([
            expect.objectContaining({ name: 'id', type: 'varchar', isPrimary: true }),
            expect.objectContaining({ name: 'nome', type: 'varchar', length: '100' }),
            expect.objectContaining({ name: 'email', type: 'varchar', length: '255' }),
            expect.objectContaining({ name: 'data_nascimento', type: 'date' }),
            expect.objectContaining({ name: 'telefone', type: 'varchar', length: '15' }),
            expect.objectContaining({ name: 'endereco', type: 'varchar', length: '200' }),
            expect.objectContaining({ name: 'documento_cpf', type: 'varchar', length: '14' }),
            expect.objectContaining({ 
              name: 'sexo', 
              type: 'enum', 
              enum: ['Masculino', 'Feminino', 'Outro'] 
            }),
            expect.objectContaining({ 
              name: 'data_cadastro', 
              type: 'timestamp', 
              default: 'CURRENT_TIMESTAMP' 
            }),
            expect.objectContaining({ 
              name: 'data_atualizacao', 
              type: 'timestamp', 
              default: 'CURRENT_TIMESTAMP' 
            }),
            expect.objectContaining({ 
              name: 'status', 
              type: 'enum', 
              enum: ['Ativo', 'Inativo'],
              default: "'Ativo'"
            }),
          ]),
        }),
        true,
      );
    });

    it('should create exame table with correct structure', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'exame',
          columns: expect.arrayContaining([
            expect.objectContaining({ name: 'id', type: 'varchar', isPrimary: true }),
            expect.objectContaining({ name: 'nome_exame', type: 'varchar', length: '100' }),
            expect.objectContaining({ 
              name: 'modalidade', 
              type: 'enum', 
              enum: ['CR', 'CT', 'DX', 'MG', 'MR', 'NM', 'OT', 'PT', 'RF', 'US', 'XA'] 
            }),
            expect.objectContaining({ name: 'id_paciente', type: 'varchar', length: '36' }),
            expect.objectContaining({ name: 'data_exame', type: 'timestamp' }),
            expect.objectContaining({ name: 'idempotencyKey', type: 'varchar', length: '255' }),
            expect.objectContaining({ 
              name: 'data_cadastro', 
              type: 'timestamp', 
              default: 'CURRENT_TIMESTAMP' 
            }),
            expect.objectContaining({ 
              name: 'data_atualizacao', 
              type: 'timestamp', 
              default: 'CURRENT_TIMESTAMP' 
            }),
          ]),
        }),
        true,
      );
    });

    it('should create paciente CPF unique index', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createIndex).toHaveBeenCalledWith(
        'paciente',
        expect.objectContaining({
          name: 'IDX_PACIENTE_CPF_UNIQUE',
          columnNames: ['documento_cpf'],
          isUnique: true,
        }),
      );
    });

    it('should create exame idempotency unique index', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createIndex).toHaveBeenCalledWith(
        'exame',
        expect.objectContaining({
          name: 'IDX_EXAME_IDEMPOTENCY_UNIQUE',
          columnNames: ['idempotencyKey'],
          isUnique: true,
        }),
      );
    });

    it('should create exame paciente index', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createIndex).toHaveBeenCalledWith(
        'exame',
        expect.objectContaining({
          name: 'IDX_EXAME_PACIENTE',
          columnNames: ['id_paciente'],
        }),
      );
    });

    it('should create foreign key constraint', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringMatching(/ALTER TABLE "exame".*ADD CONSTRAINT "FK_EXAME_PACIENTE".*FOREIGN KEY \("id_paciente"\).*REFERENCES "paciente"\("id"\).*ON DELETE CASCADE/s),
      );
    });

    it('should call createTable twice (paciente and exame)', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createTable).toHaveBeenCalledTimes(2);
    });

    it('should call createIndex three times (CPF, idempotency, paciente)', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.createIndex).toHaveBeenCalledTimes(3);
    });
  });

  describe('down', () => {
    it('should drop foreign key constraint', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        'ALTER TABLE "exame" DROP CONSTRAINT "FK_EXAME_PACIENTE"',
      );
    });

    it('should drop exame table', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('exame');
    });

    it('should drop paciente table', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.dropTable).toHaveBeenCalledWith('paciente');
    });

    it('should execute operations in correct order', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalled();
      expect(mockQueryRunner.dropTable).toHaveBeenCalledTimes(2);
    });
  });

  describe('migration class', () => {
    it('should have correct name', () => {
      expect(migration.constructor.name).toBe('CreateInitialTables1700000000000');
    });

    it('should implement MigrationInterface', () => {
      expect(typeof migration.up).toBe('function');
      expect(typeof migration.down).toBe('function');
    });
  });
});
