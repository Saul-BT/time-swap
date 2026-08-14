import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';

export class OutDeviceDto {
    @ApiProperty({
        example: 3,
    })
    @IsNumber()
    id!: number;
    @ApiProperty({
        example: 'Irrigation System',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: 'This device ...',
    })
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty({
        example: Status.CONNECTED,
    })
    @IsEnum(Status)
    @IsNotEmpty()
    status!: Status;
}
