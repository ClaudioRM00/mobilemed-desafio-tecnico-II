"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const paciente_entity_1 = require("../pacientes/entities/paciente.entity");
const exame_entity_1 = require("../exames/entities/exame.entity");
exports.databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'mobilemed_db',
    schema: process.env.DB_SCHEMA || 'public',
    entities: [paciente_entity_1.Paciente, exame_entity_1.Exame],
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: false,
    migrationsTableName: 'migrations',
    extra: {
        max: 20,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
    },
};
//# sourceMappingURL=database.config.js.map