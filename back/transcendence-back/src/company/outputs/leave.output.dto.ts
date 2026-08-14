import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import * as dotenv from 'dotenv';
import { Role } from '../../common/enums/role.enum';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`; // Recuperar el nombre del .env
dotenv.config({ path: envFile }); // Configurar la variable global para el .env

export class LeaveCompanyOutputDTO {
    /**
     * Los datos de ejemplo se genera con el ENUM de ROLE y datos del .env
     */
    @ApiProperty({
        example: `${Role.USER}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
    })
    @IsString()
    @IsNotEmpty()
    user_mail!: string;

    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    leave!: boolean;
}
