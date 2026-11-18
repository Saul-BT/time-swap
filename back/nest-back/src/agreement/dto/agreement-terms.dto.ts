import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { AgreementModality } from '../enums/agreement-modality.enum';
import { ExchangeMode } from '../enums/exchange-mode.enum';
import { ExpenseItemDto, ServiceItemDto } from './agreement-items.dto';

export class AgreementTermsDto {
    @IsEnum(ExchangeMode, { message: 'exchangeMode must be timeCredits or directSwap' })
    exchangeMode!: ExchangeMode;

    // Créditos: 1 servicio. Trueque: 2 servicios (uno por cada parte). Lo afina el servicio.
    @IsArray({ message: 'services must be an array' })
    @ArrayMinSize(1, { message: 'services must have at least 1 item' })
    @ArrayMaxSize(2, { message: 'services must have at most 2 items' })
    @ValidateNested({ each: true })
    @Type(() => ServiceItemDto)
    services!: ServiceItemDto[];

    @IsEnum(AgreementModality, { message: 'modality must be inPerson or remote' })
    modality!: AgreementModality;

    // Obligatorio si es presencial. Zona aproximada o canal remoto, nunca una dirección exacta.
    @ValidateIf((dto: AgreementTermsDto) => dto.modality === AgreementModality.IN_PERSON || dto.locationOrChannel !== undefined)
    @IsString({ message: 'locationOrChannel must be a string' })
    @IsNotEmpty({ message: 'locationOrChannel must not be empty' })
    @MaxLength(350, { message: 'locationOrChannel must be at most 350 characters' })
    locationOrChannel?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'startDateTime must be a valid date' })
    startDateTime?: Date;

    @IsOptional()
    @IsArray({ message: 'expenses must be an array' })
    @ArrayMaxSize(20, { message: 'expenses must have at most 20 items' })
    @ValidateNested({ each: true })
    @Type(() => ExpenseItemDto)
    expenses?: ExpenseItemDto[];

    @IsString({ message: 'cancellationTerms must be a string' })
    @IsNotEmpty({ message: 'cancellationTerms must not be empty' })
    @MaxLength(1000, { message: 'cancellationTerms must be at most 1000 characters' })
    cancellationTerms!: string;
}