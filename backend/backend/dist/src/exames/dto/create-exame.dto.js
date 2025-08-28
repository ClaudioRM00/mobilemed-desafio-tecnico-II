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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExameDto = void 0;
const exame_entity_1 = require("../entities/exame.entity");
const class_validator_1 = require("class-validator");
class CreateExameDto {
    nome_exame;
    modalidade;
    id_paciente;
    data_exame;
    idempotencyKey;
}
exports.CreateExameDto = CreateExameDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome do exame é obrigatório' }),
    (0, class_validator_1.MinLength)(3, { message: 'Nome do exame deve ter pelo menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Nome do exame deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateExameDto.prototype, "nome_exame", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(exame_entity_1.Modalidade, {
        message: 'Modalidade deve ser uma das seguintes: CR, CT, DX, MG, MR, NM, OT, PT, RF, US, XA'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Modalidade é obrigatória' }),
    __metadata("design:type", String)
], CreateExameDto.prototype, "modalidade", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'ID do paciente deve ser um UUID válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID do paciente é obrigatório' }),
    __metadata("design:type", String)
], CreateExameDto.prototype, "id_paciente", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Data do exame deve ser uma data válida' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Data do exame é obrigatória' }),
    __metadata("design:type", Date)
], CreateExameDto.prototype, "data_exame", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Chave de idempotência é obrigatória' }),
    (0, class_validator_1.MinLength)(10, { message: 'Chave de idempotência deve ter pelo menos 10 caracteres' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Chave de idempotência deve ter no máximo 255 caracteres' }),
    __metadata("design:type", String)
], CreateExameDto.prototype, "idempotencyKey", void 0);
//# sourceMappingURL=create-exame.dto.js.map