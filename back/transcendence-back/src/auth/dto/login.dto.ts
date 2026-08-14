import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import * as dotenv from 'dotenv';
import { Role } from '../../common/enums/role.enum';
import { APPConstants } from 'src/common/constants/app-constants';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`; // Recuperar el nombre del .env
dotenv.config({ path: envFile }); // Configurar la variable global para el .env

export class LoginDto {
    /**
     * Los datos de ejemplo vienen desde el .env
     */
    @ApiProperty({
        example: `${Role.USER}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
    })
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID'
        },
    )
    readonly mail!: string;

    /**
     * La contraseña debe cumplir las siguientes reglas:
     *  - No debe contener espacios
     *  - Al menos una letra mayúscula
     *  - Al menos una letra minúscula
     *  - Al menos un número
     *  - Al menos un carácter especial (de los de la lista)
     *  - Entre APPConstants.USER_PASSWORD_MIN_LENGTH y APPConstants.USER_PASSWORD_MAX_LENGTH caracteres (El límite de caracteres para hashear de Bcrypt es de 72Bytes)
     *  - Se permiten letras con tildes y ñ
     */
    @ApiProperty({
        example: `${Role.USER.charAt(0).toUpperCase() + Role.USER.slice(1).toLowerCase()}${process.env.SEEDED_USERS_PASS}`,
    })
    @IsString()
    @MinLength(APPConstants.USER_PASSWORD_MIN_LENGTH, {
        message: 'NAME MIN LENGTH'
    })
    @MaxLength(APPConstants.USER_PASSWORD_MAX_LENGTH, {
        message: 'PASSWORD MAX LENGTH'
    })
    @Matches(/^\S*$/, {
        message: 'PASSWORD NO SPACES'
    })
    @Matches(/.*[a-záéíóúüñ].*/, {
        message: 'PASSWORD ONE LOWERCASE'
    })
    @Matches(/.*[A-ZÁÉÍÓÚÜÑ].*/, {
        message: 'PASSWORD ONE UPPERCASE'
    })
    @Matches(/.*[0-9].*/, {
        message: 'PASSWORD ONE NUMBER'
    })
    @Matches(/.*[!@#$%^&*()_+{}[\]:;<>,.?\/~_\+\-=|].*/, {
        message: 'PASSWORD ONE SPECIAL CHAR'
    })
    @Transform(({ value }) => value.trim())
    readonly password!: string;
}
