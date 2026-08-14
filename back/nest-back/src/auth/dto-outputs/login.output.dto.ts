import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { Language } from '../../user/enums/language.enum';

/**
 * Clase privada para declarar datos de ejemplo. NO EXPORTAR.
 */
class UserDTO {
    @ApiProperty({ example: 'correo@hosting.com' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: Role.USER })
    @IsEnum(Role)
    @IsNotEmpty()
    role!: Role;

    @ApiProperty({ example: 'Pepe' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsNotEmpty()
    twoFactorCode!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    validated!: boolean;

    @ApiProperty({ example: Language.ES })
    @IsEnum(Language)
    @IsNotEmpty()
    language!: Language;
}

/**
 * Clase privada para declarar datos de ejemplo. NO EXPORTAR.
 */
class BackendTokensDTO {
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvcnJlb0Bob3N0aW5nLmNvbSIsInJvbGUiOiJmcmVlIiwiaWF0IjoxNzI4MDc3NzEzLCJleHAiOjE3MjgwNzc4MzN9.Dh2Erof1boThJcO3fh_Prh4AJf4TftYWoYsw_Dm65Yo',
    })
    @IsString()
    @IsNotEmpty()
    access_token!: string;

    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvcnJlb0Bob3N0aW5nLmNvbSIsInJvbGUiOiJmcmVlIiwiaWF0IjoxNzI4MDc3NzEzLCJleHAiOjE4MTQ0Nzc3MTN9.Xn4SIDaxiuzustHoVoQu3qWaA3q1W4Gh8JJFiZhtEjk',
    })
    @IsString()
    @IsNotEmpty()
    refres_token!: string;

    @ApiProperty({ example: 1728077833614 })
    @IsNumber()
    @IsNotEmpty()
    expires_in!: number;
}

export class LoginOutputDto {
    @ApiProperty({ type: UserDTO })
    user!: UserDTO;

    @ApiProperty({ type: BackendTokensDTO })
    backend_tokens!: BackendTokensDTO;
}
