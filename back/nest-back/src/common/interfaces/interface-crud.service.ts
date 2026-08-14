import { PaginatedResponse } from '../dtos/paginated.dto';

export interface ICrudService<T, CreateDto, UpdateDto> {
    create(createDto: CreateDto, ...args: any[]): Promise<any>;
    findOne(id: number | string): Promise<T>;
    findAll(): Promise<T[]>;
    update(id: number | string, updateDto: UpdateDto, ...args: any[]): Promise<any>;
    delete(id: number | string): Promise<void | string | boolean>;
}

export interface ICrudServiceWithPagination<T, CreateDto, UpdateDto> extends ICrudService<T, CreateDto, UpdateDto> {
    findAllWithPagination(page?: number, limit?: number): Promise<PaginatedResponse<T>>;
}
