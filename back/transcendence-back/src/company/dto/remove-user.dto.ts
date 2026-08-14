import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as dotenv from 'dotenv';
import { Role } from '../../common/enums/role.enum';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`; // Recuperar el nombre del .env
dotenv.config({ path: envFile }); // Configurar la variable global para el .env

export class RemoveUserDTO {
    /**
     * Los datos de ejemplo se genera con el ENUM de ROLE y datos del .env
     */
    @ApiProperty({
        example: `${Role.ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
    })
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID'
        },
    )
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    readonly mail!: string;
}
