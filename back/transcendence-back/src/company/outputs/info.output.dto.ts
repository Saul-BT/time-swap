import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import * as dotenv from 'dotenv';
import { Role } from '../../common/enums/role.enum';
import { CompanyRole } from '../enums/company-role.enum';
import { Optional } from '@nestjs/common';

// Configuración del .env
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

/**
 * Clase privada para declarar datos de ejemplo. NO EXPORTAR.
 */
class SingleEmployeeDTO {
    @ApiProperty({ example: Role.ADMIN })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: `${Role.ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
    })
    @IsEmail()
    @IsNotEmpty()
    readonly mail!: string;

    @ApiProperty({ example: CompanyRole.ADMIN })
    @IsString()
    @IsNotEmpty()
    role!: string;

    @ApiProperty({ example: '15/1/2025, 12:20:21' })
    @IsString()
    @IsNotEmpty()
    added!: string;
}

/**
 * Clase privada para declarar datos de ejemplo. NO EXPORTAR.
 */
export class SingleCompanyDTO {
    @ApiProperty({ example: 'Empresa 1' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id!: number;

    @ApiProperty({ example: '15/1/2025, 12:20:12' })
    @IsString()
    @IsNotEmpty()
    createdAt!: string;

    @ApiProperty({ example: CompanyRole.OWNER })
    @IsEnum(CompanyRole)
    @IsNotEmpty()
    requester_role!: CompanyRole;

    @ApiProperty({ type: [SingleEmployeeDTO] })
    @IsArray()
    employees!: SingleEmployeeDTO[];

    @ApiProperty({ example: 'httpx:example.com/image', required: false })
    @Optional()
    @IsString()
    logoUrl?: string;
}

export class CompanyInfoOutputDTO {
    @ApiProperty({
        example: {
            name: 'Empresa 1',
            id: 1,
            createdAt: '15/1/2025, 12:20:12',
            requester_role: CompanyRole.OWNER,
            employees: [
                {
                    name: Role.ADMIN,
                    mail: `${Role.ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                    role: CompanyRole.OWNER,
                    added: '15/1/2025, 12:20:21',
                },
                {
                    name: Role.USER,
                    mail: `${Role.USER}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                    role: CompanyRole.USER,
                    added: '15/1/2025, 12:30:21',
                },
            ],
        },
    })
    @IsNotEmpty()
    company!: SingleCompanyDTO;
}
