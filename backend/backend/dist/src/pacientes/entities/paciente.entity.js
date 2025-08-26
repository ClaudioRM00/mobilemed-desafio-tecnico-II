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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paciente = exports.Status = exports.Sexo = void 0;
const typeorm_1 = require("typeorm");
const crypto_1 = __importDefault(require("crypto"));
var Sexo;
(function (Sexo) {
    Sexo["Masculino"] = "Masculino";
    Sexo["Feminino"] = "Feminino";
    Sexo["Outro"] = "Outro";
})(Sexo || (exports.Sexo = Sexo = {}));
var Status;
(function (Status) {
    Status["Ativo"] = "Ativo";
    Status["Inativo"] = "Inativo";
})(Status || (exports.Status = Status = {}));
let Paciente = class Paciente {
    id;
    nome;
    email;
    data_nascimento;
    telefone;
    endereco;
    documento_cpf;
    sexo;
    data_cadastro;
    data_atualizacao;
    status;
    constructor(props, id) {
        Object.assign(this, props);
        this.id = id ?? crypto_1.default.randomUUID();
        this.data_cadastro = new Date();
        this.data_atualizacao = new Date();
        this.status = Status.Ativo;
    }
};
exports.Paciente = Paciente;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Paciente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Paciente.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Paciente.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Paciente.prototype, "data_nascimento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Paciente.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Paciente.prototype, "endereco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Paciente.prototype, "documento_cpf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: Sexo }),
    __metadata("design:type", String)
], Paciente.prototype, "sexo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Paciente.prototype, "data_cadastro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Paciente.prototype, "data_atualizacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: Status }),
    __metadata("design:type", String)
], Paciente.prototype, "status", void 0);
exports.Paciente = Paciente = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['documento_cpf'], { unique: true }),
    __metadata("design:paramtypes", [Object, String])
], Paciente);
//# sourceMappingURL=paciente.entity.js.map