import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
//import { i18nValidationMessage } from 'nestjs-i18n';
import { UserPasswordDto } from './components.dto';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class UpdatePasswordDto extends UserPasswordDto {
    @ApiProperty({
        example: 'Old_Password_01',
        description: 'Current password',
    })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    oldPassword!: string;
}
