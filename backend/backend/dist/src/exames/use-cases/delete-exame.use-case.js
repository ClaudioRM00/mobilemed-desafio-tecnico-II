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
exports.DeleteExameUseCase = void 0;
const typeorm_1 = require("typeorm");
const exame_entity_1 = require("../entities/exame.entity");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
let DeleteExameUseCase = class DeleteExameUseCase {
    exameRepo;
    constructor(exameRepo) {
        this.exameRepo = exameRepo;
    }
    async execute(id) {
        const exame = await this.exameRepo.findOne({ where: { id } });
        if (!exame) {
            throw new common_1.NotFoundException(`Exame com ID ${id} não encontrado`);
        }
        await this.exameRepo.remove(exame);
        return { message: `Exame ${exame.nome_exame} foi removido com sucesso` };
    }
};
exports.DeleteExameUseCase = DeleteExameUseCase;
exports.DeleteExameUseCase = DeleteExameUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(exame_entity_1.Exame)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], DeleteExameUseCase);
//# sourceMappingURL=delete-exame.use-case.js.map