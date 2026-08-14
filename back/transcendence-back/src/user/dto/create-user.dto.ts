import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Language } from '../enums/language.enum';
import { ApiProperty } from '@nestjs/swagger';
import { APPConstants } from 'src/common/constants/app-constants';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class CreateUserDto {
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID',
        },
    )
    mail!: string;

    /**
     * Los nombres deben cumplir las siguientes reglas:
     *  - Primera letra en mayúscula
     *  - Entre APPConstants.USER_NAME_MIN_LENGTH y APPConstants.USER_NAME_MAX_LENGTH letras (sumando primera mayúscula y resto)
     *  - Permite tildes
     *  - Permite espacios (para nombres compuestos)
     */
    @ApiProperty({ example: 'Nombre de Usuario', required: true })
    @IsString()
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @MinLength(APPConstants.USER_NAME_MIN_LENGTH, {
        message: 'NAME MIN LENGTH'
    })
    @MaxLength(APPConstants.USER_NAME_MAX_LENGTH, {
        message: 'NAME MAX LENGTH'
    })
    @Matches(/^[A-ZÁÉÍÓÚÜÑ]/, {
        message: 'NAME STARTS UPPERCASE'
    })
    @Matches(/^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]*$/, {
        message: 'NAME FORMAT'
    })
    name!: string;

    /**
     * La contraseña debe cumplir las siguientes reglas:
     *  - Al menos una letra mayúscula
     *  - Al menos una letra minúscula
     *  - Al menos un número
     *  - Al menos un carácter especial (de los de la lista)
     *  - Entre APPConstants.USER_PASSWORD_MIN_LENGTH y APPConstants.USER_PASSWORD_MAX_LENGTH caracteres (El límite de caracteres para hashear de Bcrypt es de 72Bytes)
     */
    @ApiProperty({ example: 'UnaPasswordMasFuerte1234_', required: true })
    @IsString()
    @MinLength(APPConstants.USER_PASSWORD_MIN_LENGTH, {
        message: 'PASSWORD MIN LENGTH'
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
    password!: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @IsEnum(Language)
    @IsOptional()
    language?: Language;
}
