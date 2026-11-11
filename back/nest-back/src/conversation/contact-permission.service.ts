import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactPermissionService {
    /**
     * ADR 0003: solo una solicitud de contacto ACEPTADA habilita la conversación.
     *
     * TODO (issue #26): cuando exista la gestión de solicitudes, consultar aquí
     * si hay una solicitud ACCEPTED entre las dos personas para este anuncio
     * (y comprobar bloqueos cuando existan).
     *
     * Mientras tanto, se deniega por defecto.
     */
    // eslint-disable-next-line @typescript-eslint/require-await
    async canStartConversation(
        _requesterId: number,
        _ownerId: number,
        _listingId: number,
    ): Promise<boolean> {
        return false;
    }
}