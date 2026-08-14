import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import * as dotenv from 'dotenv';
import { Role } from '../../common/enums/role.enum';
import { CompanyRole } from '../enums/company-role.enum';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`; // Recuperar el nombre del .env
dotenv.config({ path: envFile }); // Configurar la variable global para el .env

export class AddUserCompanyOutputDTO {
    /**
     * El REGEX posible del DTO de entrada no es necesario aquí, dado que esta información
     * viene directamente de la base de datos y se supone que ya ha pasado el filtro.
     */
    @ApiProperty({
        example: 'Empresa 1',
    })
    @IsString()
    @IsNotEmpty()
    company_name!: string;

    /**
     * Los datos de ejemplo se genera con el ENUM de ROLE y datos del .env
     */
    @ApiProperty({
        example: `${Role.ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
    })
    @IsString()
    @IsNotEmpty()
    new_user_mail!: string;

    @ApiProperty({
        example: Role.ADMIN,
    })
    @IsString()
    @IsNotEmpty()
    new_user_name!: string;

    @ApiProperty({
        example: Role.ADMIN,
    })
    @IsEnum(Role)
    @IsNotEmpty()
    new_user_role!: CompanyRole;

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
    added!: boolean;
}
