import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { ListingStatus } from '../listing/enums/listing-status.enum';
import { Listing } from '../listing/entities/listing.entity';
import { ContactPermissionService } from './contact-permission.service';
import { ConversationOutputDto } from './dto-outputs/conversation.output.dto';
import { MessageOutputDto } from './dto-outputs/message.output.dto';
import { OpenConversationDto } from './dto/open-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

// Código de error de Postgres cuando se rompe una restricción única
const UNIQUE_VIOLATION = '23505';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepo: Repository<Conversation>,
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        @InjectRepository(Listing)
        private readonly listingRepo: Repository<Listing>,
        private readonly contactPermission: ContactPermissionService,
    ) {}

    // 1. Crear o recuperar la conversación de un anuncio
    async open(dto: OpenConversationDto, user: UserActiveInterface): Promise<ConversationOutputDto> {
        const listing = await this.listingRepo.findOne({
            where: { id: dto.listingId },
            relations: { author: true },
        });

        // Si no existe o no está activo, decimos lo mismo: no está disponible
        if (!listing || listing.status !== ListingStatus.ACTIVE) {
            throw new NotFoundException('Listing not available');
        }

        if (listing.author.id === user.id) {
            throw new BadRequestException('You cannot contact your own listing');
        }

        // ¿Ya había una conversación de esta persona con este anuncio? Se devuelve la misma.
        const existing = await this.findByListingAndRequester(listing.id, user.id);
        if (existing) return this.toConversationOutput(existing);

        // Es nueva: ¿tiene permiso para empezarla? (ADR 0003, issue #26)
        const allowed = await this.contactPermission.canStartConversation(
            user.id,
            listing.author.id,
            listing.id,
        );
        if (!allowed) {
            throw new ForbiddenException('Contact request must be accepted first');
        }

        try {
            const saved = await this.conversationRepo.save(
                this.conversationRepo.create({
                    listing: { id: listing.id },
                    requester: { id: user.id },
                    owner: { id: listing.author.id },
                }),
            );
            const full = await this.findOneWithRelations(saved.id);
            return this.toConversationOutput(full!);
        } catch (error) {
            // Dos clics a la vez: la base de datos rechaza el duplicado, devolvemos el que ganó
            if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
                const again = await this.findByListingAndRequester(listing.id, user.id);
                if (again) return this.toConversationOutput(again);
            }
            throw error;
        }
    }

    // 2. Mis conversaciones (las que he iniciado y las de mis anuncios)
    async findMine(user: UserActiveInterface): Promise<ConversationOutputDto[]> {
        const conversations = await this.conversationRepo.find({
            where: [{ requester: { id: user.id } }, { owner: { id: user.id } }],
            relations: { listing: true, requester: true, owner: true },
            order: { createdAt: 'DESC' },
        });
        return conversations.map((c) => this.toConversationOutput(c));
    }

    // 3. y 5. Mensajes de una conversación (sirve también para recargar)
    async getMessages(conversationId: number, user: UserActiveInterface): Promise<MessageOutputDto[]> {
        await this.getForParticipant(conversationId, user.id);

        const messages = await this.messageRepo.find({
            where: { conversation: { id: conversationId } },
            relations: { sender: true },
            order: { createdAt: 'ASC', id: 'ASC' },
        });
        return messages.map((m) => this.toMessageOutput(m, conversationId));
    }

    // 4. Enviar un mensaje
    async sendMessage(
        conversationId: number,
        dto: SendMessageDto,
        user: UserActiveInterface,
    ): Promise<MessageOutputDto> {
        await this.getForParticipant(conversationId, user.id);

        // TODO (bloqueos, CON-08): comprobar aquí que ninguna de las partes ha bloqueado a la otra

        const saved = await this.messageRepo.save(
            this.messageRepo.create({
                conversation: { id: conversationId },
                sender: { id: user.id }, // SIEMPRE el usuario del token
                content: dto.content,
            }),
        );
        return {
            id: saved.id,
            conversationId,
            senderId: user.id,
            content: saved.content,
            createdAt: saved.createdAt,
        };
    }

    // ---------- Ayudantes privados ----------

    // Devuelve la conversación solo si el usuario participa; si no, 404 (no revelamos que existe)
    private async getForParticipant(conversationId: number, userId: number): Promise<Conversation> {
        const conversation = await this.conversationRepo.findOne({
            where: [
                { id: conversationId, requester: { id: userId } },
                { id: conversationId, owner: { id: userId } },
            ],
        });
        if (!conversation) throw new NotFoundException('Conversation not found');
        return conversation;
    }

    private findByListingAndRequester(listingId: number, requesterId: number) {
        return this.conversationRepo.findOne({
            where: { listing: { id: listingId }, requester: { id: requesterId } },
            relations: { listing: true, requester: true, owner: true },
        });
    }

    private findOneWithRelations(id: number) {
        return this.conversationRepo.findOne({
            where: { id },
            relations: { listing: true, requester: true, owner: true },
        });
    }

    private toConversationOutput(c: Conversation): ConversationOutputDto {
        return {
            id: c.id,
            listingId: c.listing.id,
            listingTitle: c.listing.title,
            requester: { id: c.requester.id, name: c.requester.name },
            owner: { id: c.owner.id, name: c.owner.name },
            createdAt: c.createdAt,
        };
    }

    private toMessageOutput(m: Message, conversationId: number): MessageOutputDto {
        return {
            id: m.id,
            conversationId,
            senderId: m.sender.id,
            content: m.content,
            createdAt: m.createdAt,
        };
    }
}