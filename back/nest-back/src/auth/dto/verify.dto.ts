import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class VerifyDto {
    @ApiProperty({ example: 'correo@hosting.com' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID'
        },
    )
    readonly mail!: string;

    @ApiProperty({ example: 'BunchOfTextAndNumbers' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    readonly verificationToken!: string;
}
