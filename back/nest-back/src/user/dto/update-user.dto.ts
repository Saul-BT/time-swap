import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserInterestsDto, UserSkillsDto } from './components.dto';
//import { i18nValidationMessage } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

//todo use partial types and components here instead of redefinition
export class UpdateUserDto extends IntersectionType(
    PartialType(OmitType(CreateUserDto, ['password'])),
    PartialType(UserInterestsDto),
    PartialType(UserSkillsDto)
) {
    @ApiProperty({ example: 'true', required: false })
    @IsBoolean()
    @IsOptional()
    twoFactorCode?: boolean;
}
