import { Column, Entity, PrimaryColumn, Index } from 'typeorm';
import crypto from 'crypto';

export enum Sexo {
  Masculino = 'Masculino',
  Feminino = 'Feminino',
  Outro = 'Outro',
}

export enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

@Entity()
@Index(['documento_cpf'], { unique: true }) // Índice único para CPF
export class Paciente {
  @PrimaryColumn()
  id: string; //UUID único
  @Column({ type: 'varchar' })
  nome: string;
  @Column({ type: 'varchar' })
  email: string;
  @Column({ type: 'date' })
  data_nascimento: Date;
  @Column({ type: 'varchar' })
  telefone: string; //Formato: (XX) XXXXX-XXXX
  @Column({ type: 'varchar' })
  endereco: string;
  @Column({ type: 'varchar' })
  documento_cpf: string; //Formato: XXX.XXX.XXX-XX
  @Column({ type: 'simple-enum', enum: Sexo })
  sexo: Sexo; //Valores possíveis: 'Masculino', 'Feminino', 'Outro'
  @Column({ type: 'timestamp' })
  data_cadastro: Date; //Data e hora do cadastro
  @Column({ type: 'timestamp' })
  data_atualizacao: Date; //Data e hora da última atualização
  @Column({ type: 'simple-enum', enum: Status })
  status: Status; //Valores possíveis: 'Ativo', 'Inativo'

  constructor(
    props?: {
      nome: string;
      email: string;
      data_nascimento: Date;
      telefone: string;
      endereco: string;
      documento_cpf: string;
      sexo: Sexo;
      status?: Status;
    },
    id?: string,
  ) {
    // Inicializar propriedades com valores padrão
    this.id = id ?? crypto.randomUUID();
    this.data_cadastro = new Date();
    this.data_atualizacao = new Date();
    this.status = Status.Ativo;

    // Aplicar propriedades se fornecidas
    if (props) {
      Object.assign(this, props);
      this.status = props.status || Status.Ativo;
    }
  }
}
