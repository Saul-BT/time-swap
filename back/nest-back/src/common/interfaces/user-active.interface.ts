import { Language } from 'src/user/enums/language.enum';
import { Role } from '../enums/role.enum';

/**
 * Es IMPORTANTE que todos los métodos que implementen UserActiveInterface deben llevar el decorador
 * de Auth() junto a los roles correspondientes para funcionar.
 */

export interface UserActiveInterface {
    id: number;
    name: string;
    mail: string;
    role: Role;
    validated: boolean;
    language: Language;
}
