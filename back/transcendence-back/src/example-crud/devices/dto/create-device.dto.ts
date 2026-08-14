import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

export class CreateDeviceDto {
    @ApiProperty({
        example: 'Irrigation System',
    })
    @IsString()
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('error.VALIDATION.IS_NOT_EMPTY'),
    })
    name!: string;

    @ApiProperty({
        example: 'This device ...',
    })
    @IsString()
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('error.VALIDATION.IS_NOT_EMPTY'),
    })
    description!: string;

    @ApiProperty({
        example: Status.CONNECTED,
    })
    @IsEnum(Status)
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('error.VALIDATION.IS_NOT_EMPTY'),
    })
    status!: Status;
}
