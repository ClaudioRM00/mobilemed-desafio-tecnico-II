import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Paciente } from '../modules/pacientes/entities/paciente.entity';
import { Exame } from '../modules/exames/entities/exame.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'mobilemed_db',
  schema: process.env.DB_SCHEMA || 'public',
  entities: [Paciente, Exame],
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  // Use JS compilado para migrações quando rodando a aplicação
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  extra: {
    max: 20,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
};
