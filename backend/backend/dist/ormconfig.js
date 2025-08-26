"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const paciente_entity_1 = require("./backend/src/pacientes/entities/paciente.entity");
const exame_entity_1 = require("./backend/src/exames/entities/exame.entity");
(0, dotenv_1.config)();
const isDev = process.env.NODE_ENV !== 'production';
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'mobilemed_db',
    schema: process.env.DB_SCHEMA || 'public',
    entities: [paciente_entity_1.Paciente, exame_entity_1.Exame],
    migrations: isDev ? ['src/database/migrations/*.ts'] : ['dist/database/migrations/*.js'],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: isDev,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
//# sourceMappingURL=ormconfig.js.map