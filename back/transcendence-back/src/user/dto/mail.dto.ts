import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class MailDto {
    @ApiProperty({ example: 'correo@hosting.com' })
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID'
        }
    )
    mail!: string;
}
