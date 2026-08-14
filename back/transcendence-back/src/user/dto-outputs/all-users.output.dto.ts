import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { Optional } from '@nestjs/common';
import { Language } from '../enums/language.enum';

/**
 * Clase para declarar datos de usuario de salida.
 */
export class UserInfoDTO {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id!: number;

    @ApiProperty({ example: 'Nombre usuario' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'correo1@hosting.com' })
    @IsEmail()
    @IsNotEmpty()
    mail!: string;

    @ApiProperty({ example: 'admin' })
    @IsEnum(Role)
    @IsNotEmpty()
    role!: Role;

    @ApiProperty({ example: Language.ES })
    @IsEnum(Language)
    @IsNotEmpty()
    language!: Language;

    @ApiProperty({ example: 'https://example.com/1-user/userinfo/image.png', required: false })
    @Optional()
    @IsString()
    avatarUrl?: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsNotEmpty()
    twoFactorCode!: boolean;

    @ApiProperty({ example: '15/1/2025, 12:20:12' })
    @IsNotEmpty()
    createdAt!: string;
}

export class AllUsersOutputDto {
    @ApiProperty({
        type: [UserInfoDTO],
        example: [
            { id: 1, mail: 'correo1@hosting.com', role: 'admin', twoFactorCode: true },
            { id: 2, mail: 'correo2@hosting.com', role: 'user', twoFactorCode: false },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => UserInfoDTO)
    user!: UserInfoDTO[];
}
