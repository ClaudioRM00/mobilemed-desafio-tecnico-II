"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExameDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
class _UpdateExameDto {
    nome_exame;
    modalidade;
    id_paciente;
    data_exame;
}
class UpdateExameDto extends (0, mapped_types_1.PartialType)(_UpdateExameDto) {
}
exports.UpdateExameDto = UpdateExameDto;
//# sourceMappingURL=update-exame.dto.js.map