"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamesModule = void 0;
const common_1 = require("@nestjs/common");
const exames_service_1 = require("./exames.service");
const exames_controller_1 = require("./exames.controller");
const typeorm_1 = require("@nestjs/typeorm");
const exame_entity_1 = require("./entities/exame.entity");
const paciente_entity_1 = require("../pacientes/entities/paciente.entity");
const create_exame_use_case_1 = require("./use-cases/create-exame.use-case");
const update_exame_use_case_1 = require("./use-cases/update-exame.use-case");
const delete_exame_use_case_1 = require("./use-cases/delete-exame.use-case");
const common_module_1 = require("../common/common.module");
let ExamesModule = class ExamesModule {
};
exports.ExamesModule = ExamesModule;
exports.ExamesModule = ExamesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([exame_entity_1.Exame, paciente_entity_1.Paciente]),
            common_module_1.CommonModule,
        ],
        controllers: [exames_controller_1.ExamesController],
        providers: [exames_service_1.ExamesService, create_exame_use_case_1.CreateExameUseCase, update_exame_use_case_1.UpdateExameUseCase, delete_exame_use_case_1.DeleteExameUseCase],
    })
], ExamesModule);
//# sourceMappingURL=exames.module.js.map