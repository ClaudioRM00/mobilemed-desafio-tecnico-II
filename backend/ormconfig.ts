import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Paciente } from './src/modules/pacientes/entities/paciente.entity';
import { Exame } from './src/modules/exames/entities/exame.entity';

config();

const isDev = process.env.NODE_ENV !== 'production';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'mobilemed_db',
  schema: process.env.DB_SCHEMA || 'public',
  entities: [Paciente, Exame],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: true, // Enable synchronize for development
  logging: isDev,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
