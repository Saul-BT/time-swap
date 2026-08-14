import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class CreateCompanyDTO {
    /**
     * En caso de necesidad, se puede añadir un REGEX aquí para controlar nombres de
     * empresa, debido a la posibilidad de empresas extranjeras, con caracteres en
     * otros idiomas o símbolos especiales, se deja a discreción de cada proyecto por
     * separado.
     */
    @ApiProperty({ example: 'Empresa 1' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    readonly company_name!: string;
}
