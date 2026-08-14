import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
//import { i18nValidationMessage } from 'nestjs-i18n';
import { APPConstants } from 'src/common/constants/app-constants';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class UpdatePasswordDto {
    @ApiProperty({
        example: 'Old_Password_01',
        description: 'Current password',
    })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    oldPassword!: string;

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
        message: 'PASSWORD NO SPACE'
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
    newPassword!: string;
}
