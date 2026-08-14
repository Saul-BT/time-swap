import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDTO {
    @ApiProperty({ example: 'Empresa renombrada 1' })
    @IsOptional()
    @IsString()
    new_company_name?: string;
}
