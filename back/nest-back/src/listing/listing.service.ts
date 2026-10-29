import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingOutputDto } from './dto-outputs/listing.output.dto';
import { Listing } from './entities/listing.entity';
import { ListingMode } from './enums/listing-mode.enum';
import { ListingStatus } from './enums/listing-status.enum';

@Injectable()
export class ListingService {
    constructor(
        @InjectRepository(Listing)
        private readonly listingRepository: Repository<Listing>,
    ) {}

    /** Publica un anuncio activo a nombre del usuario autenticado (ANU-01, ANU-02, ANU-03). */
    async create(dto: CreateListingDto, user: UserActiveInterface): Promise<ListingOutputDto> {
        const listing = this.listingRepository.create({
            ...dto,
            // En un anuncio remoto no se guarda zona.
            area: dto.mode === ListingMode.REMOTE ? null : (dto.area ?? null),
            status: ListingStatus.ACTIVE,
            // Solo se enlaza por id: no hace falta cargar el usuario entero.
            author: { id: user.id },
        });

        const saved = await this.listingRepository.save(listing);

        return {
            id: saved.id,
            kind: saved.kind,
            title: saved.title,
            description: saved.description,
            category: saved.category,
            mode: saved.mode,
            area: saved.area,
            hours: saved.hours,
            status: saved.status,
            authorId: user.id,
            authorName: user.name,
            createdAt: saved.createdAt,
        };
    }
}