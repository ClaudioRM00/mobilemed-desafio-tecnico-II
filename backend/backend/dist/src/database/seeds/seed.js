"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const paciente_entity_1 = require("../../pacientes/entities/paciente.entity");
const exame_entity_1 = require("../../exames/entities/exame.entity");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'mobilemed_db',
    schema: process.env.DB_SCHEMA || 'public',
    entities: [paciente_entity_1.Paciente, exame_entity_1.Exame],
    synchronize: false,
    logging: true,
});
async function seed() {
    try {
        await dataSource.initialize();
        console.log('📦 Conectado ao banco de dados');
        const pacienteRepository = dataSource.getRepository(paciente_entity_1.Paciente);
        const exameRepository = dataSource.getRepository(exame_entity_1.Exame);
        await exameRepository.clear();
        await pacienteRepository.clear();
        console.log('🧹 Dados existentes removidos');
        const pacientes = [
            new paciente_entity_1.Paciente({
                nome: 'João Silva Santos',
                email: 'joao.silva@email.com',
                data_nascimento: new Date('1990-05-15'),
                telefone: '(11) 98765-4321',
                endereco: 'Rua das Flores, 123 - Bairro Centro - São Paulo/SP',
                documento_cpf: '123.456.789-00',
                sexo: paciente_entity_1.Sexo.Masculino,
            }),
            new paciente_entity_1.Paciente({
                nome: 'Maria Oliveira Costa',
                email: 'maria.oliveira@email.com',
                data_nascimento: new Date('1985-08-22'),
                telefone: '(21) 99876-5432',
                endereco: 'Av. Principal, 456 - Copacabana - Rio de Janeiro/RJ',
                documento_cpf: '987.654.321-00',
                sexo: paciente_entity_1.Sexo.Feminino,
            }),
            new paciente_entity_1.Paciente({
                nome: 'Carlos Eduardo Lima',
                email: 'carlos.lima@email.com',
                data_nascimento: new Date('1995-12-10'),
                telefone: '(31) 98765-1234',
                endereco: 'Rua das Palmeiras, 789 - Savassi - Belo Horizonte/MG',
                documento_cpf: '456.789.123-00',
                sexo: paciente_entity_1.Sexo.Masculino,
            }),
        ];
        const pacientesSalvos = await pacienteRepository.save(pacientes);
        console.log(`✅ ${pacientesSalvos.length} pacientes criados`);
        const exames = [
            new exame_entity_1.Exame({
                nome_exame: 'Raio-X de Tórax',
                modalidade: exame_entity_1.Modalidade.CR,
                id_paciente: pacientesSalvos[0].id,
                data_exame: new Date('2024-01-15T10:00:00Z'),
                idempotencyKey: 'exame-001-raio-x-torax-2024-01-15',
            }),
            new exame_entity_1.Exame({
                nome_exame: 'Tomografia Computadorizada do Crânio',
                modalidade: exame_entity_1.Modalidade.CT,
                id_paciente: pacientesSalvos[1].id,
                data_exame: new Date('2024-01-16T14:30:00Z'),
                idempotencyKey: 'exame-002-tc-cranio-2024-01-16',
            }),
            new exame_entity_1.Exame({
                nome_exame: 'Ressonância Magnética da Coluna',
                modalidade: exame_entity_1.Modalidade.MR,
                id_paciente: pacientesSalvos[2].id,
                data_exame: new Date('2024-01-17T09:15:00Z'),
                idempotencyKey: 'exame-003-rm-coluna-2024-01-17',
            }),
            new exame_entity_1.Exame({
                nome_exame: 'Ultrassonografia Abdominal',
                modalidade: exame_entity_1.Modalidade.US,
                id_paciente: pacientesSalvos[0].id,
                data_exame: new Date('2024-01-18T11:45:00Z'),
                idempotencyKey: 'exame-004-us-abdominal-2024-01-18',
            }),
        ];
        const examesSalvos = await exameRepository.save(exames);
        console.log(`✅ ${examesSalvos.length} exames criados`);
        console.log('🎉 Seed concluído com sucesso!');
        console.log('\n📊 Resumo:');
        console.log(`   - Pacientes: ${pacientesSalvos.length}`);
        console.log(`   - Exames: ${examesSalvos.length}`);
    }
    catch (error) {
        console.error('❌ Erro durante o seed:', error);
        process.exit(1);
    }
    finally {
        await dataSource.destroy();
        console.log('🔌 Conexão com banco fechada');
    }
}
seed();
//# sourceMappingURL=seed.js.map