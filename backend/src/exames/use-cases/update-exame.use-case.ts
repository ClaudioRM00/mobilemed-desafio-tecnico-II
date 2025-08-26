import { InjectRepository } from "@nestjs/typeorm";
import { UpdateExameDto } from "../dto/update-exame.dto";
import { Exame } from "../entities/exame.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class UpdateExameUseCase {
    constructor(
        @InjectRepository(Exame)
        private exameRepo: Repository<Exame>,
    ) {}
    
    async update(id: string, input: UpdateExameDto)
    {
        const exame = await this.exameRepo.findOne({ where: { id } });
        
        if (!exame) {
            throw new NotFoundException(`Exame com ID ${id} não encontrado`);
        }

        const mudancas: Partial<Exame> = {};
        let houveAlteracao = false;
 
        const camposAtualizaveis: (keyof UpdateExameDto)[] = [
            "data_exame",
            "id_paciente",
            "modalidade",
            "nome_exame"
        ];

        for (const campo of camposAtualizaveis) {
            if (input[campo] !== undefined && input[campo] !== exame[campo]) {
                (mudancas as any)[campo] = input[campo];
                houveAlteracao = true;
            }
        }

        if (houveAlteracao) {
            mudancas.data_atualizacao = new Date();
            
            Object.assign(exame, mudancas);
            await this.exameRepo.save(exame);
        }

        return exame;
    }
}