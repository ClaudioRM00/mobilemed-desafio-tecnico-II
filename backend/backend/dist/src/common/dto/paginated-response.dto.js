"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseDto = void 0;
class PaginatedResponseDto {
    data;
    meta;
    constructor(data, page, pageSize, total) {
        this.data = data;
        this.meta = {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
            hasNext: page < Math.ceil(total / pageSize),
            hasPrevious: page > 1,
        };
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
//# sourceMappingURL=paginated-response.dto.js.map