export declare class PaginatedResponseDto<T> {
    data: T[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    constructor(data: T[], page: number, pageSize: number, total: number);
}
