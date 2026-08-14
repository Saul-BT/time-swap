import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * Pese a ser una clase anidada, se exporta para poder rellenar Correctamente los datos
 * dentro del servicio.
 */
export class CompanyInfoDTO {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    companyId!: number;

    @ApiProperty({ example: 'Empresa 1' })
    @IsString()
    @IsNotEmpty()
    companyName!: string;
}

export class LastOwnerOutputDTO {
    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    isLastOwner!: boolean;

    @ApiProperty({ type: [CompanyInfoDTO] })
    @IsArray()
    @IsNotEmpty()
    companies!: CompanyInfoDTO[];
}
