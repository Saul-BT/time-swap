import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Language } from '../enums/language.enum';
import { ApiProperty } from '@nestjs/swagger';
import { APPConstants } from 'src/common/constants/app-constants';
import { Type } from 'class-transformer';

export class UserMailDto {
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID',
        },
    )
    mail!: string;
}

/**
 * Los nombres deben cumplir las siguientes reglas:
 *  - Primera letra en mayúscula
 *  - Entre APPConstants.USER_NAME_MIN_LENGTH y APPConstants.USER_NAME_MAX_LENGTH letras (sumando primera mayúscula y resto)
 *  - Permite tildes
 *  - Permite espacios (para nombres compuestos)
*/
export class UserNameDto {
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
}

export class UserNicknameDto {
    @ApiProperty({ example: 'Nickname de Usuario', required: true })
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
    nickname!: string;
}

/**
 * La contraseña debe cumplir las siguientes reglas:
 *  - Al menos una letra mayúscula
 *  - Al menos una letra minúscula
 *  - Al menos un número
 *  - Al menos un carácter especial (de los de la lista)
 *  - Entre APPConstants.USER_PASSWORD_MIN_LENGTH y APPConstants.USER_PASSWORD_MAX_LENGTH caracteres (El límite de caracteres para hashear de Bcrypt es de 72Bytes)
*/
export class UserPasswordDto {
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
}

export class UserRoleDto {
    @IsEnum(Role)
    role!: Role;
}

export class UserLanguageDto {
    @IsEnum(Language)
    language!: Language;
}

export class UserPostalCodeDto {
    @IsString() //not a number, some countries can have leading 0
    postalCode!: string;
}

export class UserSkillsDto {
    @ApiProperty({ example: [1, 2, 3] })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => Number)
    @IsInt({ each: true })
    @Min(1, { each: true })
    readonly skills!: number[];
}

export class UserInterestsDto {
    @ApiProperty({ example: [1, 2, 3] })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => Number)
    @IsInt({ each: true })
    @Min(1, { each: true })
    readonly interests!: number[];
}
