import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginLog } from '../../auth/entities/user-login-log.entity';
import { ErrorManager } from 'src/common/error-handling/error.manager';
//import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserLoginService {
    private readonly logger = new Logger(UserLoginService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(LoginLog)
        private readonly loginLogRepository: Repository<LoginLog>,
        //private readonly i18n: I18nService,
    ) {}

    

    /**
     * Actualiza la fecha del último login del usuario y devuelve la fecha anterior
     * 
     * @param userId    ID del usuario
     * @returns         La fecha del último login anterior o null si no existía
     */
    async updateLoginDate(userId: number): Promise<Date | null> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        const oldLastLogin = user.lastLogIn;
        user.lastLogIn = new Date();
        await this.userRepository.save(user);

        return oldLastLogin;
    }
    /**
     * Extiende el tiempo de conexión de un usuario
     *
     * @param userId ID del usuario
     * @param additionalMinutes Minutos adicionales de conexión
     * @returns LoginLog actualizado o null si no se encontró
     */
    async extendUserConnection(userId: number, additionalMinutes: number = 60): Promise<LoginLog | null> {
        const loginLog = await this.loginLogRepository.findOne({
            where: { user: { id: userId }, wasSuccessful: true },
            order: { connectedUntil: 'DESC' },
        });

        if (loginLog && loginLog.connectedUntil > new Date()) {
            loginLog.connectedUntil = new Date(loginLog.connectedUntil.getTime() + additionalMinutes * 60 * 1000);
            await this.loginLogRepository.save(loginLog);

            this.logger.debug(`Connection extended for user ${userId} by ${additionalMinutes} minutes`);
            return loginLog;
        }

        return null;
    }
}