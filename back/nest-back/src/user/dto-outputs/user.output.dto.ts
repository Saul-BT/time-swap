import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UserOutputDto {
    @ApiProperty({ example: 'correo1@hosting.com' })
    @IsEmail()
    @IsNotEmpty()
    mail!: string;

    @ApiProperty({ example: 'free' })
    @IsEnum(Role)
    @IsNotEmpty()
    role!: Role;
}
