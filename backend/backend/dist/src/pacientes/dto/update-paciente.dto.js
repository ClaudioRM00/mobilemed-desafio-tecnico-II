"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePacienteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
class _UpdatePacienteDto {
    nome;
    email;
    data_nascimento;
    documento_cpf;
    endereco;
    sexo;
    telefone;
    data_atualizacao;
    status;
}
class UpdatePacienteDto extends (0, mapped_types_1.PartialType)(_UpdatePacienteDto) {
}
exports.UpdatePacienteDto = UpdatePacienteDto;
//# sourceMappingURL=update-paciente.dto.js.map