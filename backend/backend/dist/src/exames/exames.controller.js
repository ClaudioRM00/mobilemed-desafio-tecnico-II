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
exports.ExamesController = void 0;
const common_1 = require("@nestjs/common");
const exames_service_1 = require("./exames.service");
const create_exame_dto_1 = require("./dto/create-exame.dto");
const update_exame_dto_1 = require("./dto/update-exame.dto");
const create_exame_use_case_1 = require("./use-cases/create-exame.use-case");
const update_exame_use_case_1 = require("./use-cases/update-exame.use-case");
const delete_exame_use_case_1 = require("./use-cases/delete-exame.use-case");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let ExamesController = class ExamesController {
    examesService;
    createExameUseCase;
    updateExameUseCase;
    deleteExameUseCase;
    constructor(examesService, createExameUseCase, updateExameUseCase, deleteExameUseCase) {
        this.examesService = examesService;
        this.createExameUseCase = createExameUseCase;
        this.updateExameUseCase = updateExameUseCase;
        this.deleteExameUseCase = deleteExameUseCase;
    }
    create(createExameDto) {
        return this.createExameUseCase.execute(createExameDto);
    }
    findAll(paginationDto) {
        return this.examesService.findAll(paginationDto);
    }
    findOne(id) {
        return this.examesService.findOne(id);
    }
    update(id, updateExameDto) {
        return this.updateExameUseCase.update(id, updateExameDto);
    }
    remove(id) {
        return this.deleteExameUseCase.execute(id);
    }
};
exports.ExamesController = ExamesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exame_dto_1.CreateExameDto]),
    __metadata("design:returntype", void 0)
], ExamesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ExamesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_exame_dto_1.UpdateExameDto]),
    __metadata("design:returntype", void 0)
], ExamesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExamesController.prototype, "remove", null);
exports.ExamesController = ExamesController = __decorate([
    (0, common_1.Controller)('exames'),
    __metadata("design:paramtypes", [exames_service_1.ExamesService,
        create_exame_use_case_1.CreateExameUseCase,
        update_exame_use_case_1.UpdateExameUseCase,
        delete_exame_use_case_1.DeleteExameUseCase])
], ExamesController);
//# sourceMappingURL=exames.controller.js.map