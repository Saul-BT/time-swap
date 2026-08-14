import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from '../entities/user.entity';
import { Language } from '../enums/language.enum';
import { APPConstants } from 'src/common/constants/app-constants';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class UpdateUserDto {
    @ApiProperty({ example: 'correo1@hosting.com', required: false })
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID'
        },
    )
    @IsOptional()
    mail?: string;

    /**
     * Los nombres deben cumplir las siguientes reglas:
     *  - Primera letra en mayúscula
     *  - Entre APPConstants.USER_NAME_MIN_LENGTH y APPConstants.USER_NAME_MAX_LENGTH letras (sumando primera mayúscula y resto)
     *  - Permite tildes
     *  - Permite espacios (para nombres compuestos)
     */
    @ApiProperty({ example: 'Nombre de Usuario', required: false })
    @IsOptional()
    @IsString()
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
        message: 'NAME FORMAT',
    })
    name?: string;

    @ApiProperty({ example: Role.ADMIN, required: false })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @ApiProperty({ example: 'true', required: false })
    @IsBoolean()
    @IsOptional()
    twoFactorCode?: boolean;

    @ApiProperty({ example: Language.ES })
    @IsEnum(Language)
    @IsOptional()
    language?: Language;
}
