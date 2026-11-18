import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
    list!: T[];
    @ApiProperty({ example: 1 })
    page!: number;
    @ApiProperty({ example: 10 })
    pageSize!: number;
    @ApiProperty({ example: 100 })
    total!: number;
    @ApiProperty({ example: 5 })
    totalPages?: number;
}
