import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';

export class UpdateDeviceDto {
    @ApiProperty({
        example: 'Irrigation System',
    })
    @IsString()
    @IsOptional()
    name!: string;

    @ApiProperty({
        example: 'This device ...',
    })
    @IsString()
    @IsOptional()
    description!: string;

    @ApiProperty({
        example: Status.CONNECTED,
    })
    @IsEnum(Status)
    @IsOptional()
    status!: Status;
}
