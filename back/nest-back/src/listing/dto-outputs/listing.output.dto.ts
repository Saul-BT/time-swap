import { ApiProperty } from '@nestjs/swagger';
import { ListingKind } from '../enums/listing-kind.enum';
import { ListingMode } from '../enums/listing-mode.enum';
import { ListingStatus } from '../enums/listing-status.enum';

/**
 * Respuesta pública de un anuncio. A propósito NO incluye la entidad `author`
 * completa (llevaría email y otros datos privados): solo su id y su nombre.
 */
export class ListingOutputDto {
    @ApiProperty() id!: number;
    @ApiProperty({ enum: ListingKind }) kind!: ListingKind;
    @ApiProperty() title!: string;
    @ApiProperty() description!: string;
    @ApiProperty() category!: string;
    @ApiProperty({ enum: ListingMode }) mode!: ListingMode;
    @ApiProperty({ nullable: true, type: String }) area!: string | null;
    @ApiProperty() hours!: string;
    @ApiProperty({ enum: ListingStatus }) status!: ListingStatus;
    @ApiProperty() authorId!: number;
    @ApiProperty() authorName!: string;
    @ApiProperty() createdAt!: Date;
}