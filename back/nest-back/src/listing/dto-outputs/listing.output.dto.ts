import { ApiProperty } from '@nestjs/swagger';
import { ListingKind } from '../enums/listing-kind.enum';
import { ListingMode } from '../enums/listing-mode.enum';
import { ListingStatus } from '../enums/listing-status.enum';
import { ReviewOutputDto } from './review.output.dto';

/**
 * Respuesta pública de un anuncio. A propósito NO incluye la entidad `author`
 * completa (llevaría email y otros datos privados): solo su id y su nombre.
 */
export class ListingOutputDto {
    @ApiProperty() id!: number;
    @ApiProperty() title!: string;
    @ApiProperty() summary!: string;
    @ApiProperty({ enum: ListingKind }) kind!: string;
    @ApiProperty({ enum: ListingMode }) mode!: string;
    @ApiProperty() byline!: string;
    @ApiProperty() hours!: string;
    @ApiProperty() categoryId!: number;
    @ApiProperty() categoryName!: string;
    @ApiProperty() authorId!: number;
    @ApiProperty() authorName!: string;
    @ApiProperty({ nullable: true, type: String }) area?: string;
    @ApiProperty({ enum: ListingStatus }) status!: ListingStatus;
    @ApiProperty() createdAt!: Date;
    @ApiProperty({ nullable: true, type: ReviewOutputDto }) reviewByAuthor?: ReviewOutputDto;
    @ApiProperty({ nullable: true, type: ReviewOutputDto }) reviewByOther?: ReviewOutputDto;
}