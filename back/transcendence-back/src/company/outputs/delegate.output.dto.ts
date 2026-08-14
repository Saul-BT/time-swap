import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import * as dotenv from 'dotenv';
import { Role } from '../../common/enums/role.enum';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`; // Recuperar el nombre del .env
dotenv.config({ path: envFile }); // Configurar la variable global para el .env

export class DelegateCompanyOutputDTO {
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
    new_owner_mail!: string;

    @ApiProperty({
        example: Role.ADMIN,
    })
    @IsString()
    @IsNotEmpty()
    new_owner_name!: string;

    @ApiProperty({
        example: '2025-01-15T10:13:55.330Z',
    })
    @IsDate()
    @IsNotEmpty()
    updatedAt!: Date;
}
