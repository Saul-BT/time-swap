import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCompanyOutputDTO {
    @ApiProperty({
        example: 'Empresa 1',
    })
    @IsString()
    @IsNotEmpty()
    company_name!: string;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    id!: number;

    @ApiProperty({
        example: '2025-01-15T10:13:55.330Z',
    })
    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;

    @ApiProperty({
        example: '2025-01-15T10:13:55.330Z',
    })
    @IsDate()
    @IsNotEmpty()
    updatedAt!: Date;
}
