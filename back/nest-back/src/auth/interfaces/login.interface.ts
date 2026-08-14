import { Language } from 'src/user/enums/language.enum';
import { Role } from '../../common/enums/role.enum';

export interface LoginInterface {
    user: {
        // Datos del usuario que queremos mostrar
        id: number;
        name: string; // Nombre del usuario (sin apellido)
        mail: string; // Correo del usuario registrado
        role: Role; // Rol actual del usuario
        validated: boolean;
        language: Language;
        twoFactorCode: boolean;
        companies: number;
        //avatarURL: string;
        theme: string | null;
        lastLogIn: Date;
    };
    backend_tokens: {
        access_token: string; // Token JWT de acceso (requerido para el login)
        refresh_token: string; // Token JWT para el middleware, se refresca cada X tiempo, definido en .env
        expires_in: number; // Cuando expira la sesión, usando el objeto Date. Milisegundos desde 1 de enero de 1970 00:00:00 UTC
    };
}
