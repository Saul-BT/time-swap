import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { ListingKind } from '../enums/listing-kind.enum';
import { ListingMode } from '../enums/listing-mode.enum';

export class CreateListingDto {
    @ApiProperty({ enum: ListingKind, example: ListingKind.OFFER })
    @IsEnum(ListingKind, { message: 'KIND INVALID' })
    kind!: ListingKind;

    @ApiProperty({ example: 'Clases de bicicleta para adultos' })
    @IsString()
    @IsNotEmpty({ message: 'TITLE EMPTY' })
    @MaxLength(120)
    title!: string;

    @ApiProperty({ example: 'Te enseño a montar en bici, sin prisa, en un parque cercano.' })
    @IsString()
    @IsNotEmpty({ message: 'DESCRIPTION EMPTY' })
    @MaxLength(2000)
    description!: string;

    @ApiProperty({ example: 'repairs' })
    @IsString()
    @IsNotEmpty({ message: 'CATEGORY EMPTY' })
    @MaxLength(50)
    category!: string;

    @ApiProperty({ enum: ListingMode, example: ListingMode.IN_PERSON })
    @IsEnum(ListingMode, { message: 'MODE INVALID' })
    mode!: ListingMode;

    /** ANU-03: un servicio presencial debe llevar zona aproximada. */
    @ApiPropertyOptional({ example: 'Centro', description: 'Obligatoria si la modalidad no es remota.' })
    @ValidateIf((dto: CreateListingDto) => dto.mode !== ListingMode.REMOTE || dto.area !== undefined)
    @IsString()
    @IsNotEmpty({ message: 'AREA REQUIRED FOR IN-PERSON LISTINGS' })
    @MaxLength(120)
    area?: string;

    @ApiProperty({ example: '1 h + material' })
    @IsString()
    @IsNotEmpty({ message: 'HOURS EMPTY' })
    @MaxLength(50)
    hours!: string;
}