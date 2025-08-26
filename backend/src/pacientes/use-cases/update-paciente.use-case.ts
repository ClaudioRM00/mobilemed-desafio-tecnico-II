import { Repository } from "typeorm";
import { Paciente } from "../entities/paciente.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";

@Injectable()
export class UpdatePacienteUseCase {
    constructor(
        @InjectRepository(Paciente)
        private pacienteRepo: Repository<Paciente>,
    ) {}
    
    async update(id: string, input: UpdatePacienteDto)
    {
        const paciente = await this.pacienteRepo.findOneOrFail({ where: { id } });

        const mudancas: Partial<Paciente> = {};
        let houveAlteracao = false;
 
        const camposAtualizaveis: (keyof UpdatePacienteDto)[] = [
            'nome',
            'email',
            'data_nascimento',
            'telefone',
            'endereco',
            'documento_cpf',
            'sexo',
            'status'
        ];

        for (const campo of camposAtualizaveis) {
            if (input[campo] !== undefined && input[campo] !== paciente[campo]) {
                // Tratar data_nascimento especificamente
                if (campo === 'data_nascimento' && typeof input[campo] === 'string') {
                    try {
                        (mudancas as any)[campo] = new Date(input[campo] + 'T00:00:00.000Z');
                    } catch (error) {
                        console.error('Erro ao converter data:', error);
                        (mudancas as any)[campo] = input[campo];
                    }
                } else {
                    (mudancas as any)[campo] = input[campo];
                }
                houveAlteracao = true;
            }
        }

        if (houveAlteracao) {
            mudancas.data_atualizacao = new Date();
            
            Object.assign(paciente, mudancas);
            await this.pacienteRepo.save(paciente);
        }

        return paciente;
    }
}