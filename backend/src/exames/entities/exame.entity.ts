import { Column, Entity, PrimaryColumn, Index } from 'typeorm';
import crypto from 'crypto';

export enum Modalidade {
  CR = 'CR',
  CT = 'CT',
  DX = 'DX',
  MG = 'MG',
  MR = 'MR',
  NM = 'NM',
  OT = 'OT',
  PT = 'PT',
  RF = 'RF',
  US = 'US',
  XA = 'XA',
}

@Entity()
@Index(['idempotencyKey'], { unique: true }) // Índice único para idempotência
export class Exame {
  @PrimaryColumn()
  id: string; //UUID único

  @Column({ type: 'varchar' })
  nome_exame: string;

  @Column({ type: 'simple-enum', enum: Modalidade })
  modalidade: Modalidade;

  @Column({ type: 'varchar' })
  id_paciente: string;

  @Column({ type: 'timestamp' })
  data_exame: Date;

  @Column({ type: 'varchar', unique: true })
  idempotencyKey: string; // Chave única para idempotência

  @Column({ type: 'timestamp' })
  data_cadastro: Date; //Data e hora do cadastro

  @Column({ type: 'timestamp' })
  data_atualizacao: Date; //Data e hora da última atualização

  constructor(
    props?: {
      nome_exame: string;
      modalidade: Modalidade;
      id_paciente: string;
      data_exame?: Date;
      idempotencyKey: string;
    },
    id?: string,
  ) {
    if (props) {
      Object.assign(this, props);
    }
    this.id = id ?? crypto.randomUUID();
    this.data_exame = props?.data_exame ?? new Date();
    this.data_cadastro = new Date();
    this.data_atualizacao = new Date();
  }
}
