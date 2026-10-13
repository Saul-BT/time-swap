import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { AuthGuard } from './auth.guard';

/**
 * Variante de AuthGuard para rutas públicas cuyo contenido cambia según quién
 * pregunta (visitante o miembro autenticado), como el perfil público
 * (issue #22). A diferencia de AuthGuard, nunca bloquea la petición: si hay
 * un token válido rellena request.user, y si no lo hay (o no es válido) deja
 * request.user sin definir y dejar decidir a la ruta qué mostrar.
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = AuthGuard.extractTokenFromHeader(request);

        if (!token) {
            return true;
        }

        try {
            const payload: UserActiveInterface = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request.user = payload;
        } catch {
            // Token presente pero inválido o caducado: se trata como visitante,
            // la petición no se bloquea por esto.
        }

        return true;
    }
}