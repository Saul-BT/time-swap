import { Role } from '../../common/enums/role.enum';

export interface VerifyInterface {
    mail: string; // Correo del usuario registrado que vamos a cancelar
    name: string; // Nombre del usuario (sin apellido)
    role: Role; // Rol del usuario que se le asignará por defecto al crearlo
    createdAt: Date; // Fecha en la que es confirmado
}
