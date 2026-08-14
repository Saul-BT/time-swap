import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * El constructor solo recibe el servicio de JWT para la gestión
     *
     * @param jwtService    Servicio de JWT para la gestión de los tokens
     */
    constructor(private readonly jwtService: JwtService) {}

    /**
     * Método que extiende de canActive(), comprueba si se puede realizar una petición o no en función de un token
     * obtenido del contexto de ejecución.
     *
     * @param context   Objeto de tipo ExecutionContext con todos los datos necesarios para la comprobación
     * @returns         true si puede realizarse la request, false si no
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = AuthGuard.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload: UserActiveInterface = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request.user = payload;

            /**
             * Comprobación para saber si el usuario está validado. Está lógica se implementa a la hora
             * de usar un 2FA. Un usuario con 2FA activado debe poder iniciar sesión en la plataforma, pero
             * no estará validado. De esa forma sew controla que el usuario (con sesión iniciada) solo puede
             * acceder a la ruta exacta de la verificación de seguridad.
             */
            if (
                !payload.validated &&
                request.url != '/api/v1/auth/verify-otp'
                // Añadir aquí mas rutas en caso de que sea necesario autorizar por otros métodos
            ) {
                throw new UnauthorizedException('User is not validated');
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    /**
     * Método para desencapsular un token de tipo "Bearer" dentro de un objeto Request
     *
     * @param request   Objeto de tipo Request con los datos encapsulados para poder obtener el token
     * @returns         Un string con el token del usuario o undefined si no encuentra el token
     */
    static extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
