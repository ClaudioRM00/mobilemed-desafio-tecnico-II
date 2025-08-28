"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacientesModule = void 0;
const common_1 = require("@nestjs/common");
const pacientes_service_1 = require("./pacientes.service");
const pacientes_controller_1 = require("./pacientes.controller");
const typeorm_1 = require("@nestjs/typeorm");
const paciente_entity_1 = require("./entities/paciente.entity");
const create_paciente_use_case_1 = require("./use-cases/create-paciente.use-case");
const update_paciente_use_case_1 = require("./use-cases/update-paciente.use-case");
const common_module_1 = require("../common/common.module");
let PacientesModule = class PacientesModule {
};
exports.PacientesModule = PacientesModule;
exports.PacientesModule = PacientesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([paciente_entity_1.Paciente]),
            common_module_1.CommonModule,
        ],
        controllers: [pacientes_controller_1.PacientesController],
        providers: [pacientes_service_1.PacientesService, create_paciente_use_case_1.CreatePacienteUseCase, update_paciente_use_case_1.UpdatePacienteUseCase],
    })
], PacientesModule);
//# sourceMappingURL=pacientes.module.js.map