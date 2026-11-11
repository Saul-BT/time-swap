import { IsInt, Min } from 'class-validator';

export class OpenConversationDto {
    @IsInt({ message: 'listingId must be an integer' })
    @Min(1, { message: 'listingId must be greater than 0' })
    listingId!: number;
}