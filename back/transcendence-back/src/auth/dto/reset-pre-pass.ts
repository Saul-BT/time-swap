import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class ResetPrePassDto {
    /**
     * Los datos de ejemplo vienen desde el .env
     */
    @ApiProperty({
        example: `${Role.USER}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
    })
    @IsEmail(
        {},
        {
            message: 'MAIL_INVALID'
        },
    )
    readonly mail!: string;
}
