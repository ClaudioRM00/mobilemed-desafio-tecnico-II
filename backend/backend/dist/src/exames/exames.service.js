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
exports.ExamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const exame_entity_1 = require("./entities/exame.entity");
const typeorm_2 = require("@nestjs/typeorm");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
let ExamesService = class ExamesService {
    exameRepo;
    constructor(exameRepo) {
        this.exameRepo = exameRepo;
    }
    async findAll(paginationDto) {
        const { page = 1, pageSize = 10 } = paginationDto;
        const skip = (page - 1) * pageSize;
        const [data, total] = await this.exameRepo.findAndCount({
            skip,
            take: pageSize,
            order: { data_cadastro: 'DESC' },
        });
        return new paginated_response_dto_1.PaginatedResponseDto(data, page, pageSize, total);
    }
    findOne(id) {
        return this.exameRepo.findOneOrFail({ where: { id } });
    }
};
exports.ExamesService = ExamesService;
exports.ExamesService = ExamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(exame_entity_1.Exame)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ExamesService);
//# sourceMappingURL=exames.service.js.map