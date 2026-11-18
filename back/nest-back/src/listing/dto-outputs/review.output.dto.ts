import { ApiProperty } from '@nestjs/swagger';

export class ReviewOutputDto {
    @ApiProperty() id!: number;
    @ApiProperty() score!: number;
    @ApiProperty() description?: string;
    @ApiProperty() authorId!: number;
    @ApiProperty() reviewedId!: number;
    @ApiProperty() createdAt!: Date;
}