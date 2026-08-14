import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { Language } from '../../user/enums/language.enum';

export class VerifyOutputDto {
    @ApiProperty({ example: 'correo@hosting.com' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: 'Pepe' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: Role.USER })
    @IsEnum(Role)
    @IsNotEmpty()
    role!: Role;

    @ApiProperty({ example: '2022-03-15T12:00:00Z' })
    @IsString()
    @IsNotEmpty()
    createdAt!: Date;

    @ApiProperty({ example: Language.ES })
    @IsEnum(Language)
    @IsNotEmpty()
    language!: Language;
}
