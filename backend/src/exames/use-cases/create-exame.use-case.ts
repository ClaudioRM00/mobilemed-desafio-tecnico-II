import { Repository } from "typeorm";
import { CreateExameDto } from "../dto/create-exame.dto";
import { Exame } from "../entities/exame.entity";
import { Paciente } from "../../pacientes/entities/paciente.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { TransactionService } from "../../common/services/transaction.service";

@Injectable()
export class CreateExameUseCase {
    constructor(
        @InjectRepository(Exame)
        private exameRepo: Repository<Exame>,
        @InjectRepository(Paciente)
        private pacienteRepo: Repository<Paciente>,
        private transactionService: TransactionService,
    ) {}
    
    async execute(input: CreateExameDto) {
        return this.transactionService.executeInTransaction(async (queryRunner) => {
            // Verificar se já existe um exame com a mesma idempotencyKey
            const exameExistente = await queryRunner.manager.findOne(Exame, {
                where: { idempotencyKey: input.idempotencyKey }
            });

            if (exameExistente) {
                // Retornar o exame existente (idempotência)
                return exameExistente;
            }

            // Verificar se o paciente existe
            const paciente = await queryRunner.manager.findOne(Paciente, {
                where: { id: input.id_paciente }
            });

            if (!paciente) {
                throw new NotFoundException('Paciente não encontrado');
            }

            // Verificar se o paciente está ativo
            if (paciente.status !== 'Ativo') {
                throw new ConflictException('Não é possível criar exame para paciente inativo');
            }

            const exame = new Exame(input);
            return queryRunner.manager.save(Exame, exame);
        });
    }
}