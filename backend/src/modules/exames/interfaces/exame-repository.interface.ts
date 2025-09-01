import { Exame } from '../entities/exame.entity';

export interface IExameRepository {
  create(data: Partial<Exame>): Promise<Exame>;
  save(entity: Exame): Promise<Exame>;
  findOne(criteria: any): Promise<Exame | null>;
  find(criteria: any): Promise<Exame[]>;
  findAndCount(options: any): Promise<[Exame[], number]>;
  remove(entity: Exame): Promise<void>;
  createQueryBuilder(alias: string): any;
}
