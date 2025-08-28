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
exports.CreatePacienteDto = void 0;
const paciente_entity_1 = require("../entities/paciente.entity");
const class_validator_1 = require("class-validator");
class CreatePacienteDto {
    nome;
    email;
    data_nascimento;
    telefone;
    endereco;
    documento_cpf;
    sexo;
}
exports.CreatePacienteDto = CreatePacienteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    (0, class_validator_1.MinLength)(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email deve ser um endereço válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email é obrigatório' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Data de nascimento deve ser uma data válida' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Data de nascimento é obrigatória' }),
    __metadata("design:type", Date)
], CreatePacienteDto.prototype, "data_nascimento", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Telefone é obrigatório' }),
    (0, class_validator_1.Matches)(/^\(\d{2}\) \d{5}-\d{4}$/, {
        message: 'Telefone deve estar no formato (XX) XXXXX-XXXX'
    }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "telefone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Endereço é obrigatório' }),
    (0, class_validator_1.MinLength)(10, { message: 'Endereço deve ter pelo menos 10 caracteres' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Endereço deve ter no máximo 200 caracteres' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "endereco", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'CPF é obrigatório' }),
    (0, class_validator_1.Matches)(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
        message: 'CPF deve estar no formato XXX.XXX.XXX-XX'
    }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "documento_cpf", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(paciente_entity_1.Sexo, { message: 'Sexo deve ser Masculino, Feminino ou Outro' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Sexo é obrigatório' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "sexo", void 0);
//# sourceMappingURL=create-paciente.dto.js.map