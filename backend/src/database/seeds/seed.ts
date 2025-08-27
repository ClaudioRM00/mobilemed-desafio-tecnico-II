import { DataSource } from 'typeorm';
import { Paciente, Sexo } from '../../pacientes/entities/paciente.entity';
import { Exame, Modalidade } from '../../exames/entities/exame.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'mobilemed_db',
    entities: [Paciente, Exame],
    synchronize: true,
  });

  await dataSource.initialize();

  const pacienteRepository = dataSource.getRepository(Paciente);
  const exameRepository = dataSource.getRepository(Exame);

  // Limpar dados existentes
  await exameRepository.clear();
  await pacienteRepository.clear();

  // Criar pacientes de exemplo
  const paciente1 = new Paciente({
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    data_nascimento: new Date('1990-05-15'),
    telefone: '(11) 99999-1111',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    documento_cpf: '123.456.789-01',
    sexo: Sexo.Masculino,
  });

  const paciente2 = new Paciente({
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    data_nascimento: new Date('1985-08-22'),
    telefone: '(11) 99999-2222',
    endereco: 'Av. Paulista, 456 - São Paulo, SP',
    documento_cpf: '987.654.321-02',
    sexo: Sexo.Feminino,
  });

  const paciente3 = new Paciente({
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    data_nascimento: new Date('1995-03-10'),
    telefone: '(11) 99999-3333',
    endereco: 'Rua Augusta, 789 - São Paulo, SP',
    documento_cpf: '456.789.123-03',
    sexo: Sexo.Masculino,
  });

  const paciente4 = new Paciente({
    nome: 'Ana Costa',
    email: 'ana.costa@email.com',
    data_nascimento: new Date('1988-12-05'),
    telefone: '(11) 99999-4444',
    endereco: 'Rua Oscar Freire, 321 - São Paulo, SP',
    documento_cpf: '789.123.456-04',
    sexo: Sexo.Feminino,
  });

  const paciente5 = new Paciente({
    nome: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    data_nascimento: new Date('1992-07-18'),
    telefone: '(11) 99999-5555',
    endereco: 'Av. Brigadeiro Faria Lima, 654 - São Paulo, SP',
    documento_cpf: '321.654.987-05',
    sexo: Sexo.Masculino,
  });

  // Salvar pacientes
  const pacientesSalvos = await pacienteRepository.save([
    paciente1,
    paciente2,
    paciente3,
    paciente4,
    paciente5,
  ]);

  console.log('✅ Pacientes criados:', pacientesSalvos.length);

  // Criar exames de exemplo
  const exames = [
    new Exame({
      nome_exame: 'Ressonância Magnética do Crânio',
      modalidade: Modalidade.MR,
      id_paciente: pacientesSalvos[0].id,
      data_exame: new Date('2024-01-15'),
      idempotencyKey: 'rm-cranio-001',
    }),
    new Exame({
      nome_exame: 'Tomografia Computadorizada do Tórax',
      modalidade: Modalidade.CT,
      id_paciente: pacientesSalvos[1].id,
      data_exame: new Date('2024-01-16'),
      idempotencyKey: 'tc-torax-001',
    }),
    new Exame({
      nome_exame: 'Radiografia do Tórax',
      modalidade: Modalidade.DX,
      id_paciente: pacientesSalvos[2].id,
      data_exame: new Date('2024-01-17'),
      idempotencyKey: 'rx-torax-001',
    }),
    new Exame({
      nome_exame: 'Ultrassonografia Abdominal',
      modalidade: Modalidade.US,
      id_paciente: pacientesSalvos[3].id,
      data_exame: new Date('2024-01-18'),
      idempotencyKey: 'us-abdomen-001',
    }),
    new Exame({
      nome_exame: 'Mamografia Bilateral',
      modalidade: Modalidade.MG,
      id_paciente: pacientesSalvos[4].id,
      data_exame: new Date('2024-01-19'),
      idempotencyKey: 'mamo-bilateral-001',
    }),
    new Exame({
      nome_exame: 'Ressonância Magnética da Coluna',
      modalidade: Modalidade.MR,
      id_paciente: pacientesSalvos[0].id,
      data_exame: new Date('2024-01-20'),
      idempotencyKey: 'rm-coluna-001',
    }),
    new Exame({
      nome_exame: 'Tomografia Computadorizada do Abdome',
      modalidade: Modalidade.CT,
      id_paciente: pacientesSalvos[1].id,
      data_exame: new Date('2024-01-21'),
      idempotencyKey: 'tc-abdome-001',
    }),
    new Exame({
      nome_exame: 'Radiografia da Coluna',
      modalidade: Modalidade.DX,
      id_paciente: pacientesSalvos[2].id,
      data_exame: new Date('2024-01-22'),
      idempotencyKey: 'rx-coluna-001',
    }),
    new Exame({
      nome_exame: 'Ultrassonografia do Coração',
      modalidade: Modalidade.US,
      id_paciente: pacientesSalvos[3].id,
      data_exame: new Date('2024-01-23'),
      idempotencyKey: 'us-coracao-001',
    }),
    new Exame({
      nome_exame: 'Densitometria Óssea',
      modalidade: Modalidade.DX,
      id_paciente: pacientesSalvos[4].id,
      data_exame: new Date('2024-01-24'),
      idempotencyKey: 'densitometria-001',
    }),
  ];

  // Salvar exames
  const examesSalvos = await exameRepository.save(exames);

  console.log('✅ Exames criados:', examesSalvos.length);

  await dataSource.destroy();
  console.log('🎉 Seed concluído com sucesso!');
}

// Executar o seed
seed().catch((error) => {
  console.error('❌ Erro durante o seed:', error);
  process.exit(1);
});
