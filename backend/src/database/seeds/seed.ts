import { DataSource } from 'typeorm';
import { Paciente, Sexo, Status } from '../../pacientes/entities/paciente.entity';
import { Exame, Modalidade } from '../../exames/entities/exame.entity';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'mobilemed_db',
  schema: process.env.DB_SCHEMA || 'public',
  entities: [Paciente, Exame],
  synchronize: false,
  logging: true,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('📦 Conectado ao banco de dados');

    const pacienteRepository = dataSource.getRepository(Paciente);
    const exameRepository = dataSource.getRepository(Exame);

    // Limpar dados existentes (primeiro a tabela filha, depois a pai)
    await exameRepository.createQueryBuilder().delete().execute();
    await pacienteRepository.createQueryBuilder().delete().execute();
    console.log('🧹 Dados existentes removidos');

    // Criar pacientes de exemplo
    const pacientes = [
      new Paciente({
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com',
        data_nascimento: new Date('1990-05-15'),
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123 - Bairro Centro - São Paulo/SP',
        documento_cpf: '123.456.789-00',
        sexo: Sexo.Masculino,
      }),
      new Paciente({
        nome: 'Maria Oliveira Costa',
        email: 'maria.oliveira@email.com',
        data_nascimento: new Date('1985-08-22'),
        telefone: '(21) 99876-5432',
        endereco: 'Av. Principal, 456 - Copacabana - Rio de Janeiro/RJ',
        documento_cpf: '987.654.321-00',
        sexo: Sexo.Feminino,
      }),
      new Paciente({
        nome: 'Carlos Eduardo Lima',
        email: 'carlos.lima@email.com',
        data_nascimento: new Date('1995-12-10'),
        telefone: '(31) 98765-1234',
        endereco: 'Rua das Palmeiras, 789 - Savassi - Belo Horizonte/MG',
        documento_cpf: '456.789.123-00',
        sexo: Sexo.Masculino,
      }),
      new Paciente({
        nome: 'Ana Paula Ferreira',
        email: 'ana.ferreira@email.com',
        data_nascimento: new Date('1988-03-18'),
        telefone: '(41) 99887-6543',
        endereco: 'Rua XV de Novembro, 321 - Centro - Curitiba/PR',
        documento_cpf: '789.123.456-00',
        sexo: Sexo.Feminino,
      }),
      new Paciente({
        nome: 'Roberto Almeida Souza',
        email: 'roberto.almeida@email.com',
        data_nascimento: new Date('1975-11-05'),
        telefone: '(51) 98765-9876',
        endereco: 'Av. Borges de Medeiros, 654 - Centro Histórico - Porto Alegre/RS',
        documento_cpf: '321.654.987-00',
        sexo: Sexo.Masculino,
      }),
      new Paciente({
        nome: 'Fernanda Costa Silva',
        email: 'fernanda.costa@email.com',
        data_nascimento: new Date('1992-07-30'),
        telefone: '(81) 99876-1234',
        endereco: 'Rua da Aurora, 987 - Boa Vista - Recife/PE',
        documento_cpf: '654.321.789-00',
        sexo: Sexo.Feminino,
      }),
      new Paciente({
        nome: 'Lucas Mendes Oliveira',
        email: 'lucas.mendes@email.com',
        data_nascimento: new Date('1987-09-12'),
        telefone: '(71) 98765-5678',
        endereco: 'Av. Sete de Setembro, 456 - Centro - Salvador/BA',
        documento_cpf: '147.258.369-00',
        sexo: Sexo.Masculino,
      }),
      new Paciente({
        nome: 'Juliana Santos Pereira',
        email: 'juliana.santos@email.com',
        data_nascimento: new Date('1993-04-25'),
        telefone: '(85) 99876-4321',
        endereco: 'Rua Major Facundo, 789 - Centro - Fortaleza/CE',
        documento_cpf: '963.852.741-00',
        sexo: Sexo.Feminino,
      }),
      new Paciente({
        nome: 'Pedro Henrique Rodrigues',
        email: 'pedro.henrique@email.com',
        data_nascimento: new Date('1980-12-03'),
        telefone: '(62) 98765-8765',
        endereco: 'Av. Goiás, 234 - Centro - Goiânia/GO',
        documento_cpf: '852.963.741-00',
        sexo: Sexo.Masculino,
      }),
      new Paciente({
        nome: 'Camila Barbosa Lima',
        email: 'camila.barbosa@email.com',
        data_nascimento: new Date('1991-06-20'),
        telefone: '(67) 99876-9876',
        endereco: 'Rua 14 de Julho, 567 - Centro - Campo Grande/MS',
        documento_cpf: '741.852.963-00',
        sexo: Sexo.Feminino,
      }),
    ];

    const pacientesSalvos = await pacienteRepository.save(pacientes);
    console.log(`✅ ${pacientesSalvos.length} pacientes criados`);

    // Criar exames de exemplo
    const exames = [
      new Exame({
        nome_exame: 'Raio-X de Tórax',
        modalidade: Modalidade.CR,
        id_paciente: pacientesSalvos[0].id,
        data_exame: new Date('2024-01-15T10:00:00Z'),
        idempotencyKey: 'exame-001-raio-x-torax-2024-01-15',
      }),
      new Exame({
        nome_exame: 'Tomografia Computadorizada do Crânio',
        modalidade: Modalidade.CT,
        id_paciente: pacientesSalvos[1].id,
        data_exame: new Date('2024-01-16T14:30:00Z'),
        idempotencyKey: 'exame-002-tc-cranio-2024-01-16',
      }),
      new Exame({
        nome_exame: 'Ressonância Magnética da Coluna',
        modalidade: Modalidade.MR,
        id_paciente: pacientesSalvos[2].id,
        data_exame: new Date('2024-01-17T09:15:00Z'),
        idempotencyKey: 'exame-003-rm-coluna-2024-01-17',
      }),
      new Exame({
        nome_exame: 'Ultrassonografia Abdominal',
        modalidade: Modalidade.US,
        id_paciente: pacientesSalvos[0].id,
        data_exame: new Date('2024-01-18T11:45:00Z'),
        idempotencyKey: 'exame-004-us-abdominal-2024-01-18',
      }),
      new Exame({
        nome_exame: 'Raio-X da Coluna Lombar',
        modalidade: Modalidade.CR,
        id_paciente: pacientesSalvos[3].id,
        data_exame: new Date('2024-01-19T08:30:00Z'),
        idempotencyKey: 'exame-005-raio-x-coluna-2024-01-19',
      }),
      new Exame({
        nome_exame: 'Tomografia Computadorizada do Abdome',
        modalidade: Modalidade.CT,
        id_paciente: pacientesSalvos[4].id,
        data_exame: new Date('2024-01-20T15:45:00Z'),
        idempotencyKey: 'exame-006-tc-abdome-2024-01-20',
      }),
      new Exame({
        nome_exame: 'Ressonância Magnética do Joelho',
        modalidade: Modalidade.MR,
        id_paciente: pacientesSalvos[5].id,
        data_exame: new Date('2024-01-21T13:20:00Z'),
        idempotencyKey: 'exame-007-rm-joelho-2024-01-21',
      }),
      new Exame({
        nome_exame: 'Ultrassonografia do Coração (Ecocardiograma)',
        modalidade: Modalidade.US,
        id_paciente: pacientesSalvos[6].id,
        data_exame: new Date('2024-01-22T09:00:00Z'),
        idempotencyKey: 'exame-008-ecocardiograma-2024-01-22',
      }),
      new Exame({
        nome_exame: 'Raio-X dos Membros Superiores',
        modalidade: Modalidade.CR,
        id_paciente: pacientesSalvos[7].id,
        data_exame: new Date('2024-01-23T11:15:00Z'),
        idempotencyKey: 'exame-009-raio-x-membros-2024-01-23',
      }),
      new Exame({
        nome_exame: 'Tomografia Computadorizada do Tórax',
        modalidade: Modalidade.CT,
        id_paciente: pacientesSalvos[8].id,
        data_exame: new Date('2024-01-24T16:30:00Z'),
        idempotencyKey: 'exame-010-tc-torax-2024-01-24',
      }),
      new Exame({
        nome_exame: 'Ressonância Magnética do Ombro',
        modalidade: Modalidade.MR,
        id_paciente: pacientesSalvos[9].id,
        data_exame: new Date('2024-01-25T10:45:00Z'),
        idempotencyKey: 'exame-011-rm-ombro-2024-01-25',
      }),
      new Exame({
        nome_exame: 'Ultrassonografia Obstétrica',
        modalidade: Modalidade.US,
        id_paciente: pacientesSalvos[1].id,
        data_exame: new Date('2024-01-26T14:00:00Z'),
        idempotencyKey: 'exame-012-us-obstetrica-2024-01-26',
      }),
    ];

    const examesSalvos = await exameRepository.save(exames);
    console.log(`✅ ${examesSalvos.length} exames criados`);

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   - Pacientes: ${pacientesSalvos.length}`);
    console.log(`   - Exames: ${examesSalvos.length}`);

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexão com banco fechada');
  }
}

seed();
