import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Language } from 'src/user/enums/language.enum';

export class LanguageDto {
    @ApiProperty({ example: Language.EN })
    @IsEnum(Language)
    @IsNotEmpty()
    language!: Language;
}