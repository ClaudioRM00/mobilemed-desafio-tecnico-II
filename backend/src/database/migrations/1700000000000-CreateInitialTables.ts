import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'paciente',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true, length: '36' },
          { name: 'nome', type: 'varchar', length: '100', isNullable: false },
          { name: 'email', type: 'varchar', length: '255', isNullable: false },
          { name: 'data_nascimento', type: 'date', isNullable: false },
          {
            name: 'telefone',
            type: 'varchar',
            length: '15',
            isNullable: false,
          },
          {
            name: 'endereco',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'documento_cpf',
            type: 'varchar',
            length: '14',
            isNullable: false,
          },
          {
            name: 'sexo',
            type: 'enum',
            enum: ['Masculino', 'Feminino', 'Outro'],
            isNullable: false,
          },
          {
            name: 'data_cadastro',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'data_atualizacao',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Ativo', 'Inativo'],
            default: "'Ativo'",
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'paciente',
      new TableIndex({
        name: 'IDX_PACIENTE_CPF_UNIQUE',
        columnNames: ['documento_cpf'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'exame',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true, length: '36' },
          {
            name: 'nome_exame',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'modalidade',
            type: 'enum',
            enum: [
              'CR',
              'CT',
              'DX',
              'MG',
              'MR',
              'NM',
              'OT',
              'PT',
              'RF',
              'US',
              'XA',
            ],
            isNullable: false,
          },
          {
            name: 'id_paciente',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          { name: 'data_exame', type: 'timestamp', isNullable: false },
          {
            name: 'idempotencyKey',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'data_cadastro',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'data_atualizacao',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'exame',
      new TableIndex({
        name: 'IDX_EXAME_IDEMPOTENCY_UNIQUE',
        columnNames: ['idempotencyKey'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'exame',
      new TableIndex({
        name: 'IDX_EXAME_PACIENTE',
        columnNames: ['id_paciente'],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE "exame" 
      ADD CONSTRAINT "FK_EXAME_PACIENTE" 
      FOREIGN KEY ("id_paciente") 
      REFERENCES "paciente"("id") 
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exame" DROP CONSTRAINT "FK_EXAME_PACIENTE"`,
    );
    await queryRunner.dropTable('exame');
    await queryRunner.dropTable('paciente');
  }
}
