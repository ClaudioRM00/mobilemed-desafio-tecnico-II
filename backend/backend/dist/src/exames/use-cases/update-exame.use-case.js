"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExameUseCase = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const exame_entity_1 = require("../entities/exame.entity");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
let UpdateExameUseCase = class UpdateExameUseCase {
    exameRepo;
    constructor(exameRepo) {
        this.exameRepo = exameRepo;
    }
    async update(id, input) {
        const exame = await this.exameRepo.findOne({ where: { id } });
        if (!exame) {
            throw new common_1.NotFoundException(`Exame com ID ${id} não encontrado`);
        }
        const mudancas = {};
        let houveAlteracao = false;
        const camposAtualizaveis = [
            "data_exame",
            "id_paciente",
            "modalidade",
            "nome_exame"
        ];
        for (const campo of camposAtualizaveis) {
            if (input[campo] !== undefined && input[campo] !== exame[campo]) {
                mudancas[campo] = input[campo];
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
};
exports.UpdateExameUseCase = UpdateExameUseCase;
exports.UpdateExameUseCase = UpdateExameUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exame_entity_1.Exame)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UpdateExameUseCase);
//# sourceMappingURL=update-exame.use-case.js.map