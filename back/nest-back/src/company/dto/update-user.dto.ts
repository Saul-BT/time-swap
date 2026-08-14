import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { CompanyRole } from '../enums/company-role.enum';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class UpdateUserCompanyDTO {
    /**
     * Los datos de ejemplo se genera con el ENUM de ROLE y datos del .env
     */
    @ApiProperty({
        example: `${Role.ADMIN}@${(process.env.COMPANY_DOMAIN ?? 'Company-Example').toLowerCase()}.es`,
    })
    @IsEmail(
        {},
        {
            message: 'MAIL INVALID'
        },
    )
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    readonly mail!: string;

    @ApiProperty({ example: CompanyRole.OWNER })
    @IsEnum(CompanyRole)
    @IsOptional()
    new_role?: CompanyRole;
}
