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
class EmployeeDTO {
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
 * Clase para declarar datos de compañia de salida.
 */
export class CompanyDTO {
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

    @ApiProperty({
        type: [EmployeeDTO],
        examples: [
            {
                summary: 'Empresa con un usuario',
                value: [
                    {
                        name: Role.ADMIN,
                        mail: `${Role.ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                        role: CompanyRole.OWNER,
                        added: '15/1/2025, 12:20:21',
                    },
                ],
            },
            {
                summary: 'Empresa con varios usuarios',
                value: [
                    {
                        name: Role.USER,
                        mail: `${Role.USER}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                        role: CompanyRole.OWNER,
                        added: '15/1/2025, 12:20:21',
                    },
                    {
                        name: Role.ADMIN,
                        mail: `${Role.ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                        role: CompanyRole.USER,
                        added: '15/1/2025, 12:20:21',
                    },
                    {
                        name: Role.SUPER_ADMIN,
                        mail: `${Role.SUPER_ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                        role: CompanyRole.USER,
                        added: '15/1/2025, 12:20:21',
                    },
                ],
            },
        ],
    })
    @IsArray()
    employees!: EmployeeDTO[];

    @ApiProperty({ example: 'httpx:example.com/image', required: false })
    @Optional()
    @IsString()
    logoUrl?: string;
}

export class AllCompanyInfoOutputDTO {
    @ApiProperty({
        type: [CompanyDTO],
        example: [
            {
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
                ],
                avatarUrl: 'httpx:example.com/image',
            },
            {
                name: 'Empresa 2',
                id: 2,
                createdAt: '15/1/2025, 12:25:11',
                requester_role: CompanyRole.OWNER,
                employees: [
                    {
                        name: Role.USER,
                        mail: `${Role.USER}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                        role: CompanyRole.OWNER,
                        added: '15/1/2025, 12:20:21',
                    },
                    {
                        name: Role.ADMIN,
                        mail: `${Role.ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                        role: CompanyRole.USER,
                        added: '15/1/2025, 12:20:21',
                    },
                    {
                        name: Role.SUPER_ADMIN,
                        mail: `${Role.SUPER_ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
                        role: CompanyRole.USER,
                        added: '15/1/2025, 12:20:21',
                    },
                ],
            },
        ],
    })
    @IsArray()
    companies!: CompanyDTO[];
}
