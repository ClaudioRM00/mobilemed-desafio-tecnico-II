import { DataSource } from 'typeorm';
import { Paciente, Sexo, Status } from '../../modules/pacientes/entities/paciente.entity';
import { Exame, Modalidade } from '../../modules/exames/entities/exame.entity';

export default class Seed {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const pacienteRepository = this.dataSource.getRepository(Paciente);
    const exameRepository = this.dataSource.getRepository(Exame);

    // Criar pacientes de exemplo
    const paciente1 = new Paciente({
      nome: 'João Silva',
      email: 'joao@email.com',
      data_nascimento: new Date('1990-01-01'),
      telefone: '11999999999',
      endereco: 'Rua A, 123',
      documento_cpf: '12345678901',
      sexo: Sexo.Masculino,
      status: Status.Ativo,
    });

    const paciente2 = new Paciente({
      nome: 'Maria Santos',
      email: 'maria@email.com',
      data_nascimento: new Date('1985-05-15'),
      telefone: '11888888888',
      endereco: 'Rua B, 456',
      documento_cpf: '98765432100',
      sexo: Sexo.Feminino,
      status: Status.Ativo,
    });

    await pacienteRepository.save([paciente1, paciente2]);

    // Criar exames de exemplo
    const exame1 = new Exame({
      nome_exame: 'Ressonância Magnética',
      modalidade: Modalidade.MR,
      id_paciente: paciente1.id,
      data_exame: new Date('2024-01-15'),
      idempotencyKey: 'unique-key-123',
    });

    const exame2 = new Exame({
      nome_exame: 'Tomografia Computadorizada',
      modalidade: Modalidade.CT,
      id_paciente: paciente2.id,
      data_exame: new Date('2024-01-16'),
      idempotencyKey: 'unique-key-456',
    });

    await exameRepository.save([exame1, exame2]);

    console.log('Seed executado com sucesso!');
  }
}