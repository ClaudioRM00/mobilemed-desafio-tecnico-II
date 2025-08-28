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
exports.Exame = exports.Modalidade = void 0;
const typeorm_1 = require("typeorm");
const crypto_1 = __importDefault(require("crypto"));
var Modalidade;
(function (Modalidade) {
    Modalidade["CR"] = "CR";
    Modalidade["CT"] = "CT";
    Modalidade["DX"] = "DX";
    Modalidade["MG"] = "MG";
    Modalidade["MR"] = "MR";
    Modalidade["NM"] = "NM";
    Modalidade["OT"] = "OT";
    Modalidade["PT"] = "PT";
    Modalidade["RF"] = "RF";
    Modalidade["US"] = "US";
    Modalidade["XA"] = "XA";
})(Modalidade || (exports.Modalidade = Modalidade = {}));
let Exame = class Exame {
    id;
    nome_exame;
    modalidade;
    id_paciente;
    data_exame;
    idempotencyKey;
    data_cadastro;
    data_atualizacao;
    constructor(props, id) {
        if (props) {
            Object.assign(this, props);
        }
        this.id = id ?? crypto_1.default.randomUUID();
        this.data_exame = props?.data_exame ?? new Date();
        this.data_cadastro = new Date();
        this.data_atualizacao = new Date();
    }
};
exports.Exame = Exame;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Exame.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Exame.prototype, "nome_exame", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: Modalidade }),
    __metadata("design:type", String)
], Exame.prototype, "modalidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Exame.prototype, "id_paciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Exame.prototype, "data_exame", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], Exame.prototype, "idempotencyKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Exame.prototype, "data_cadastro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Exame.prototype, "data_atualizacao", void 0);
exports.Exame = Exame = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['idempotencyKey'], { unique: true }),
    __metadata("design:paramtypes", [Object, String])
], Exame);
//# sourceMappingURL=exame.entity.js.map