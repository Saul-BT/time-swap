import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing } from '../../listing/entities/listing.entity';
import { ListingStatus } from '../../listing/enums/listing-status.enum';
import { ContactPermissionService } from '../contact-permission.service';
import { ConversationService } from '../conversation.service';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';

// Usuarios de ejemplo. Solo importan el id y el nombre.
const ana = { id: 1, name: 'Ana' } as any; // dueña del anuncio
const beto = { id: 2, name: 'Beto' } as any; // quien contacta
const carla = { id: 3, name: 'Carla' } as any; // una extraña

const activeListing = {
    id: 10,
    title: 'Clases de guitarra',
    status: ListingStatus.ACTIVE,
    author: { id: 1 },
};

const existingConversation = {
    id: 100,
    listing: { id: 10, title: 'Clases de guitarra' },
    requester: { id: 2, name: 'Beto' },
    owner: { id: 1, name: 'Ana' },
    createdAt: new Date('2026-11-06T10:00:00Z'),
};

describe('ConversationService', () => {
    let service: ConversationService;
    let conversationRepo: { findOne: jest.Mock; find: jest.Mock; save: jest.Mock; create: jest.Mock };
    let messageRepo: { find: jest.Mock; save: jest.Mock; create: jest.Mock };
    let listingRepo: { findOne: jest.Mock };
    let permission: { canStartConversation: jest.Mock };

    beforeEach(async () => {
        conversationRepo = {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn((x) => x),
        };
        messageRepo = { find: jest.fn(), save: jest.fn(), create: jest.fn((x) => x) };
        listingRepo = { findOne: jest.fn() };
        permission = { canStartConversation: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConversationService,
                { provide: getRepositoryToken(Conversation), useValue: conversationRepo },
                { provide: getRepositoryToken(Message), useValue: messageRepo },
                { provide: getRepositoryToken(Listing), useValue: listingRepo },
                { provide: ContactPermissionService, useValue: permission },
            ],
        }).compile();

        service = module.get(ConversationService);
    });

    describe('open', () => {
        it('da 404 si el anuncio no existe', async () => {
            listingRepo.findOne.mockResolvedValue(null);
            await expect(service.open({ listingId: 99 }, beto)).rejects.toThrow(NotFoundException);
        });

        it('da 404 si el anuncio no está activo', async () => {
            listingRepo.findOne.mockResolvedValue({ ...activeListing, status: ListingStatus.PAUSED });
            await expect(service.open({ listingId: 10 }, beto)).rejects.toThrow(NotFoundException);
        });

        it('no deja contactar con tu propio anuncio', async () => {
            listingRepo.findOne.mockResolvedValue(activeListing);
            await expect(service.open({ listingId: 10 }, ana)).rejects.toThrow(BadRequestException);
        });

        it('si ya había conversación, devuelve la misma sin pedir permiso', async () => {
            listingRepo.findOne.mockResolvedValue(activeListing);
            conversationRepo.findOne.mockResolvedValue(existingConversation);

            const result = await service.open({ listingId: 10 }, beto);

            expect(result.id).toBe(100);
            expect(permission.canStartConversation).not.toHaveBeenCalled();
            expect(conversationRepo.save).not.toHaveBeenCalled();
        });

        it('da 403 si no hay permiso de contacto (ADR 0003)', async () => {
            listingRepo.findOne.mockResolvedValue(activeListing);
            conversationRepo.findOne.mockResolvedValue(null);
            permission.canStartConversation.mockResolvedValue(false);

            await expect(service.open({ listingId: 10 }, beto)).rejects.toThrow(ForbiddenException);
            expect(conversationRepo.save).not.toHaveBeenCalled();
        });

        it('crea la conversación si hay permiso', async () => {
            listingRepo.findOne.mockResolvedValue(activeListing);
            // 1ª búsqueda (¿existe ya?): no. 2ª (tras guardar): la nueva.
            conversationRepo.findOne
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(existingConversation);
            permission.canStartConversation.mockResolvedValue(true);
            conversationRepo.save.mockResolvedValue({ id: 100 });

            const result = await service.open({ listingId: 10 }, beto);

            expect(conversationRepo.save).toHaveBeenCalledTimes(1);
            expect(result.requester.id).toBe(2);
            expect(result.owner.id).toBe(1);
        });
    });

    describe('getMessages', () => {
        it('da 404 si no eres participante (no revela que existe)', async () => {
            conversationRepo.findOne.mockResolvedValue(null);
            await expect(service.getMessages(100, carla)).rejects.toThrow(NotFoundException);
            expect(messageRepo.find).not.toHaveBeenCalled();
        });

        it('devuelve los mensajes a un participante', async () => {
            conversationRepo.findOne.mockResolvedValue(existingConversation);
            messageRepo.find.mockResolvedValue([
                { id: 1, content: 'Hola', sender: { id: 2 }, createdAt: new Date() },
            ]);

            const result = await service.getMessages(100, beto);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(
                expect.objectContaining({ senderId: 2, content: 'Hola', conversationId: 100 }),
            );
        });
    });

    describe('sendMessage', () => {
        it('da 404 y no guarda nada si no eres participante', async () => {
            conversationRepo.findOne.mockResolvedValue(null);
            await expect(service.sendMessage(100, { content: 'Hola' }, carla)).rejects.toThrow(
                NotFoundException,
            );
            expect(messageRepo.save).not.toHaveBeenCalled();
        });

        it('guarda el mensaje con el remitente del token', async () => {
            conversationRepo.findOne.mockResolvedValue(existingConversation);
            messageRepo.save.mockResolvedValue({ id: 5, content: 'Hola', createdAt: new Date() });

            const result = await service.sendMessage(100, { content: 'Hola' }, beto);

            expect(messageRepo.create).toHaveBeenCalledWith({
                conversation: { id: 100 },
                sender: { id: 2 },
                content: 'Hola',
            });
            expect(result.senderId).toBe(2);
        });
    });
});