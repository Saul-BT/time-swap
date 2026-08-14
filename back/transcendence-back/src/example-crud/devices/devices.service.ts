import { Inject, Injectable } from '@nestjs/common';
import { ICrudServiceWithPagination } from 'src/common/interfaces/interface-crud.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { CrudRepository } from 'src/common/services/repository.generic';
import { FindOptionsWhere, ILike } from 'typeorm';
import { PaginatedResponse } from 'src/common/dtos/paginated.dto';

@Injectable()
export class DevicesService implements ICrudServiceWithPagination<Device, CreateDeviceDto, UpdateDeviceDto> {
    constructor(
        @Inject('DEVICE_REPOSITORY')
        private readonly deviceRepository: CrudRepository<Device>,
    ) {}

    findAllWithPagination(page?: number, limit?: number, nameFilter?: string): Promise<PaginatedResponse<Device>> {
        const where: FindOptionsWhere<Device> = {};

        if (nameFilter) where.name = ILike(`%${nameFilter.trim()}%`);

        return this.deviceRepository.findAllPaginated(page, limit, { where });
    }
    async create(createDto: CreateDeviceDto): Promise<any> {
        return await this.deviceRepository.createEntity({
            ...createDto,
        });
    }
    findOne(id: number): Promise<Device> {
        return this.deviceRepository.findOneById(id);
    }
    findAll(): Promise<Device[]> {
        return this.deviceRepository.find();
    }
    update(id: number, updateDto: UpdateDeviceDto): Promise<any> {
        return this.deviceRepository.updateEntity(id, updateDto);
    }
    delete(id: number): Promise<void | boolean> {
        return this.deviceRepository.deleteEntity(id);
    }
}
