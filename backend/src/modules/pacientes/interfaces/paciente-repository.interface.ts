import { Paciente } from '../entities/paciente.entity';

export interface IPacienteRepository {
  create(data: Partial<Paciente>): Promise<Paciente>;
  save(entity: Paciente): Promise<Paciente>;
  findOne(criteria: any): Promise<Paciente | null>;
  find(criteria: any): Promise<Paciente[]>;
  findAndCount(options: any): Promise<[Paciente[], number]>;
  remove(entity: Paciente): Promise<void>;
  createQueryBuilder(alias: string): any;
}
