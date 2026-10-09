import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { User } from 'src/user/entities/user.entity';
import { ProfileVisibility } from 'src/user/enums/profile-visibility.enum';
import { PublicProfileDto } from './dto/public-profile.dto';

/**
 * Campos opcionales que el propietario puede ocultar (CA-3). Ampliar esta
 * lista cuando la issue #5 (Gestionar perfil) defina el conjunto real.
 */
const HIDEABLE_FIELDS = ['presentation', 'areaZone', 'modalities', 'interests'] as const;
type HideableField = (typeof HIDEABLE_FIELDS)[number];

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /**
     * Devuelve el perfil público de `profileUserId`, filtrado según quién
     * pregunta. `viewer` es undefined si la petición es de un visitante sin
     * sesión (issue #22).
     */
    async getPublicProfile(profileUserId: number, viewer: UserActiveInterface | undefined): Promise<PublicProfileDto> {
        const user = await this.userRepository.findOne({ where: { id: profileUserId } });

        // CA-11: no se distingue entre inexistente, suspendido o retirado.
        if (!user) {
            throw new NotFoundException('Profile not available');
        }

        const isOwnProfile = viewer?.id === user.id;

        // La visibilidad del perfil para visitantes la decide su propietario (CA-4, CA-5).
        if (!viewer && !isOwnProfile && user.profileVisibility !== ProfileVisibility.PUBLIC) {
            throw new UnauthorizedException('Sign in required to view this profile');        }

        // TODO issue #32 / CON-08: un miembro bloqueado no puede consultar el
        // perfil de quien lo bloqueó (CA-9). No implementado: no existe
        // todavía ninguna entidad de bloqueo entre miembros.

        const hidden = new Set<HideableField>((user.hiddenFields ?? []) as HideableField[]);
        const showField = (field: HideableField) => isOwnProfile || !hidden.has(field);

        return {
            id: user.id,
            name: user.name ?? '',
            presentation: showField('presentation') ? user.presentation : null,
            areaZone: showField('areaZone') ? user.areaZone : null,
            modalities: showField('modalities') ? (user.modalities ?? []) : [],
            skills: user.skills ?? [],
            interests: showField('interests') ? (user.interests ?? []) : [],
            verified: user.verified,
            isOwnProfile,
            // ANU (anuncios activos) no existe todavía: estado vacío (definición de hecho de #22).
            activeListings: [],
            // INT-05 (reputación) no existe todavía: estado vacío, nunca "mala reputación" (CA-6).
            reputation: { hasHistory: false },
        };
    }
}