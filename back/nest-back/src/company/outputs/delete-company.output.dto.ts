import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class DeleteCompanyOutputDTO {
    @ApiProperty({
        example: 'Empresa 1',
    })
    @IsString()
    @IsNotEmpty()
    company_name!: string;

    @ApiProperty({
        example: '2025-01-15T10:13:55.330Z',
    })
    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;

    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    deleted!: boolean;
}
