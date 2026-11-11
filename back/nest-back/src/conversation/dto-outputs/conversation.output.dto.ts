export class ParticipantOutputDto {
    id!: number;
    name!: string | null;
}

export class ConversationOutputDto {
    id!: number;
    listingId!: number;
    listingTitle!: string;
    requester!: ParticipantOutputDto;
    owner!: ParticipantOutputDto;
    createdAt!: Date;
}