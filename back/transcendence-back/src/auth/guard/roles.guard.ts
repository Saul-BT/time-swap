import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ErrorManager } from 'src/common/error-handling/error.manager';
//import { I18nService } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class RolesGuard implements CanActivate {
    /**
     * El constructor declara un objeto de tipo Reflector para recuperar la información delmétodo al que
     * se quiere acceder (metadatos)
     *
     * @param reflector     Datos encapsulados para los metadatos del método
     */
    constructor(
        //private readonly i18n: I18nService<I18nTranslations>,
        private readonly reflector: Reflector,
    ) {}

    /**
     * Método que extiende de canActive(), obtiene los roles asignados a un método mediante un Reflector,
     * obtiene el rol de un usuario mediante un ExecutionContext y comprueba si el usuario tiene un rol incluido
     * en el método. En caso de que el método no tenga roles o el usuario sea SUPER_ADMIN, siempre se podrá acceder.
     *
     * @param context   Objeto de tipo ExecutionContext con todos los datos necesarios para la comprobación
     * @returns         true si puede realizarse la request, false si no
     */
    canActivate(context: ExecutionContext): boolean {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            /**
             * Si el método no tiene roles asignados, se devuelve true siempre. Un método que no tenga ningún rol
             * estipulado será accesible por todos.
             */
            if (!requiredRoles) return true;

            const { user } = context.switchToHttp().getRequest();
            if (!user) throw new ErrorManager('BAD_REQUEST', 'INVALID JWT');

            if (user.role === Role.SUPER_ADMIN)
                // Los SUPER_ADMIN siempre pueden acceder a los métodos
                return true;

            const hasValidRole = requiredRoles.some((role) => user.role?.includes(role)); // Comprobar si el rol del usuario está en los roles del método
            if (!hasValidRole) {
                throw new ErrorManager('UNAUTHORIZED', 'ROLE UNAUTHORIZED');
            }

            return true;
        } catch (error) {
            if (error instanceof ErrorManager) {
                error.throwSignatureError();
            } else {
                throw new ErrorManager('INTERNAL_SERVER_ERROR', 'AUTH GUARD ERROR');
            }
            return false;
        }
    }
}
