import { ApiProperty } from '@nestjs/swagger';
import { Device } from '../entities/device.entity';
import { OutDeviceDto } from './device-out.dto';

export class OutDevicePaginateDto {
    @ApiProperty({
        type: [Device],
        example: [
            {
                id: 1,
                name: 'Camera',
                description: 'This device ...',
                status: 'Warging',
            },
            {
                id: 2,
                name: 'Sensor',
                description: 'This device ...',
                status: 'Connected',
            },
        ],
    })
    data!: OutDeviceDto[];

    @ApiProperty({
        example: 23,
    })
    total!: number;

    @ApiProperty({
        example: 1,
    })
    page!: number;

    @ApiProperty({
        example: 10,
    })
    pageSize!: number;
}
