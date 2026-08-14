import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiNotFoundResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import { OutDeviceDto } from './dto-outputs/device-out.dto';
import { OutDevicePaginateDto } from './dto-outputs/device-out-paginated.dto';
import { PaginatedResponse } from 'src/common/dtos/paginated.dto';
import { ReturnMessage } from 'src/common/decorators/wrap-endpoint.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Devices - Ejemplo CRUD de dispositivos')
@Controller('devices')
@Auth(Role.USER, Role.ADMIN)
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {}

    @Post('create')
    @ApiOperation({
        summary: 'Crear un nuevo dispositivo',
        description: 'ADMIN, USER',
    })
    @ApiResponse({
        status: 201,
        description: 'Dispositivo creado exitosamente.',
        type: String,
    })
    @ApiBadRequestResponse({ description: 'Solicitud incorrecta.' })
    @ReturnMessage('valid.DEVICE.CREATED')
    async create(@Body() createDeviceDto: CreateDeviceDto): Promise<any> {
        return await this.devicesService.create(createDeviceDto);
    }

    @Get('get-all')
    @ApiOperation({
        summary: 'Obtener todos los dispositivos',
        description: 'ADMIN, USER',
    })
    @ApiResponse({
        status: 200,
        description: 'Listado de dispositivos.',
        type: [OutDeviceDto],
    })
    @ReturnMessage('valid.DEVICE.GOT_ALL')
    async findAll(): Promise<Device[]> {
        return this.devicesService.findAll();
    }

    @Get('get-all/paginate')
    @ApiOperation({
        summary: 'Obtener dispositivos de forma paginada',
        description: 'ADMIN, USER',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Número de página',
        example: 1,
    })
    @ApiQuery({
        name: 'pageSize',
        required: false,
        type: Number,
        description: 'Cantidad de elementos por página',
        example: 10,
    })
    @ApiQuery({ name: 'nameFilter', required: false, type: String })
    @ApiResponse({
        status: 200,
        description: 'Dispositivos paginados.',
        type: OutDevicePaginateDto,
    })
    @ReturnMessage('valid.DEVICE.GOT_PAGINATED')
    async findAllWithPagination(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
        pageSize: number,
        @Query('nameFilter') nameFilter: string,
    ): Promise<PaginatedResponse<Device>> {
        return this.devicesService.findAllWithPagination(page, pageSize, nameFilter);
    }

    @Get('get/:id')
    @Auth(Role.ADMIN)
    @ApiOperation({
        summary: 'Obtener un dispositivo por su id',
        description: 'ADMIN',
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador del dispositivo',
    })
    @ApiResponse({
        status: 200,
        description: 'Dispositivo encontrado.',
        type: OutDeviceDto,
    })
    @ApiNotFoundResponse({ description: 'Dispositivo no encontrado.' })
    @ReturnMessage('valid.DEVICE.FIND_ONE')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Device> {
        return this.devicesService.findOne(id);
    }

    @Put('update/:id')
    @Auth(Role.ADMIN)
    @ApiOperation({
        summary: 'Actualizar un dispositivo',
        description: 'ADMIN',
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador del dispositivo a actualizar',
    })
    @ApiResponse({
        status: 200,
        description: 'Dispositivo actualizado exitosamente.',
        type: Device,
    })
    @ApiNotFoundResponse({ description: 'Dispositivo no encontrado.' })
    @ReturnMessage('valid.DEVICE.UPDATED')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateDeviceDto: UpdateDeviceDto): Promise<any> {
        return this.devicesService.update(id, updateDeviceDto);
    }

    @Delete('delete/:id')
    @Auth(Role.ADMIN)
    @ApiOperation({
        summary: 'Eliminar un dispositivo',
        description: 'ADMIN',
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador del dispositivo a eliminar',
    })
    @ApiResponse({
        status: 200,
        description: 'Dispositivo eliminado exitosamente.',
        type: Boolean,
    })
    @ApiNotFoundResponse({ description: 'Dispositivo no encontrado.' })
    @ReturnMessage('valid.DEVICE.DELETED')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void | boolean> {
        return this.devicesService.delete(id);
    }
}
