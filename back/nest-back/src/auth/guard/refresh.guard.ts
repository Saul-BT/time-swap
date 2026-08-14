import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ErrorManager } from 'src/common/error-handling/error.manager';
//import { I18nService } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class RefreshGuard implements CanActivate {
    /**
     * El constructor solo recibe el servicio de JWT para la gestión
     *
     * @param jwtService    Servicio de JWT para la gestión de los tokens
     */
    constructor(
        //private readonly i18n: I18nService<I18nTranslations>,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Método que extiende de canActive() y comprueba si el token de refresco sigue siendo valido.
     *
     * @param context   Objeto de tipo ExecutionContext con todos los datos necesarios para la comprobación
     * @returns         true si puede realizarse la request, false si no
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request); // Obtener token actual del contexto

        try {
            if (!token) throw new ErrorManager('UNAUTHORIZED', 'UNAUTHORIZED USER'); // Si el token no existe, devolver excepción

            request.user = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        } catch (error: unknown) {
            if (error instanceof ErrorManager) {
                error.throwSignatureError();
            } else {
                // Crear y lanzar un nuevo ErrorManager si el error no es de este tipo
                const message = error instanceof Error ? error.message : 'Unexpected error';
                throw new ErrorManager(
                    'INTERNAL_SERVER_ERROR', // Ajusta el tipo según sea necesario
                    message,
                );
            } // Si el token no coincide, devolver excepción
        }
        return true; // Si el token si coincide, devolver true
    }

    /**
     * Método para desencapsular un token de tipo "Refresh" dentro de un objeto Request
     *
     * @param request   Objeto de tipo Request con los datos encapsulados para poder obtener el token
     * @returns         Un string con el token del usuario o undefined si no encuentra el token
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Refresh' ? token : undefined;
    }
}
