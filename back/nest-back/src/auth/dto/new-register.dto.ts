import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { MatchPasswords } from '../decorators/password-matches.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Transform } from 'class-transformer';
import { UserMailDto, UserNameDto, UserNicknameDto, UserPasswordDto, UserPostalCodeDto } from 'src/user/dto/components.dto';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class NewRegisterDto extends IntersectionType(
    UserMailDto,
    UserNameDto,
    UserNicknameDto,
    UserPasswordDto,
    PartialType(UserPostalCodeDto)
) {
    /**
     *  Se utiliza el decorador personalizado MatchPasswords para comprobar que la contraseña y la contraseña repetida
     */
    @ApiProperty({
        example: `${Role.USER.charAt(0).toUpperCase() + Role.USER.slice(1).toLowerCase()}${process.env.SEEDED_USERS_PASS}`,
    })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Transform(({ value }) => value.trim())
    @MatchPasswords('password', {
        message: 'PASSWORDS NOT MATCHING'
    })
    readonly repeatPassword!: string;
}
