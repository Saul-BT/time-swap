import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Company } from 'src/company/entities/company.entity';
import { UserCompany } from 'src/company/entities/user-company.entity';
import { CompanyRole } from 'src/company/enums/company-role.enum';
//import FileService from 'src/files/services/file-service.service';
import { Role, User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorManager } from 'src/common/error-handling/error.manager';
//import { I18nService } from 'nestjs-i18n';
import { APPConstants } from 'src/common/constants/app-constants';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class SeederService {
    /**
     * Objeto para realizar logs en la consola cuando el seeder realiza operaciones
     */
    private readonly logger = new Logger(SeederService.name);

    constructor(
        private readonly configService: ConfigService, //for reading .env values
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(UserCompany)
        private readonly userCompanyRepository: Repository<UserCompany>,
        //private readonly i18n: I18nService<I18nTranslations>,
        //@Inject(forwardRef(() => FileService))
        //private readonly fileService: FileService,
    ) {}

    getEnvVar(key: string): string {
        let value: string|undefined = this.configService.get(key);
        return value != undefined? value : '';
    }

    async seed() {
        await this.seedUsers(true);
        await this.seedCompany(true);
    }

    /**
     * Método para añadir usuarios a la base de datos. Se crea un usuario por cada permiso
     * que se encuentre en el ENUM de Role. El dominio viene establecido en el .env y la
     * contraseña se monta usando el nombre del rol y unos valores del .env
     *
     * @returns     El return se usa para romper la lógica en caso de estar en producción
     */
    async seedUsers(force: boolean = false) {
        if (force) {
            try {
                this.logger.debug('Seeding users');
                const adminAccount = this.getEnvVar('ADMIN_ACCOUNT');
                const adminPass = this.getEnvVar('ADMIN_PASS');
                const seededUsersPass = this.getEnvVar('SEEDED_USERS_PASS');

                // Si estamos en producción, solo se creará el usuario administrador del sistema
                if (process.env.NODE_ENV === 'production') {
                    await this.createSqlUser(
                        adminAccount,
                        await hash(adminPass, APPConstants.PASSWORDS_SALT_ROUNDS),
                        Role.SUPER_ADMIN,
                    );
                    return;
                }

                // Crear usuarios para cada rol (para entorno de desarrollo)
                const roleKeys = Object.keys(Role) as Array<keyof typeof Role>;
                for (const roleKey of roleKeys) {
                    const password = `${roleKey.charAt(0).toUpperCase()}${roleKey.slice(1).toLowerCase()}${seededUsersPass}`;
                    this.checkUser(roleKey, password);
                    const hashedPassword = await hash(password, APPConstants.PASSWORDS_SALT_ROUNDS);
                    await this.createSqlUser(roleKey, hashedPassword, Role[roleKey]);
                }

                this.checkUser(adminAccount, adminPass);
                const hashedAdminPass = await hash(adminPass, APPConstants.PASSWORDS_SALT_ROUNDS);
                await this.createSqlUser(adminAccount, hashedAdminPass, Role.SUPER_ADMIN);
            } catch (error: unknown) {
                this.logger.error(error);
            }
        }
    }

    async seedCompany(force: boolean = false) {
        if (force) {
            try {
                this.logger.debug('Seeding company');
                if (process.env.NODE_ENV === 'production') return;

                // Se crea un usuario para pasar por el correo para el ticket
                const accountName = Role.USER;
                const companyDomain = this.getEnvVar('COMPANY_DOMAIN');
                const mail = `${accountName.toLowerCase()}@${companyDomain.toLowerCase()}.es`;

                const user = await this.userRepository.findOneBy({
                    mail: mail,
                });
                if (!user)
                    throw error('Seeding user ' + mail + ' not found');

                const companyName = process.env.APP_NAME + ' testing company';

                // Comprobar si la compañía ya existe
                const existingCompany = await this.companyRepository.findOneBy({
                    name: companyName,
                });
                if (existingCompany) {
                    this.logger.debug(`Company ${companyName} already exists`);
                    return;
                }

                const newCompany = new Company();
                newCompany.name = companyName;
                await this.companyRepository.save(newCompany);

                const company = await this.companyRepository.findOneBy({
                    name: companyName,
                });
                if (!company)
                    throw error('Seeding company ' + companyName + ' not found');

                const userCompany = new UserCompany();
                userCompany.user = user;
                userCompany.company = company;
                userCompany.companyRole = CompanyRole.OWNER;

                await this.userCompanyRepository.save(userCompany);

                // @TODO no hace falta crear una seccion para cada compañia en cada bucket
                // const companyPath = await this.fileService.getCompanyPath(
                //     createdUserCompany.company.id,
                //     createdUserCompany.company.name,
                // );
                //await this.fileInitService.createPathInAllBuckets([companyPath]);

                this.logger.debug(`Company ${companyName} created and associated with user ${user.name}`);
            } catch (error) {
                this.logger.error(error);
            }
        }
    }

    /**
     * Comrpueba que el nombre de usuario y contraseña sean correctos.
     * Lanza un error si son incorrectos
     * @param accountName
     * @param pass
     */
    checkUser(accountName: string, pass: string) {
        if (accountName.length < APPConstants.USER_NAME_MIN_LENGTH) {
            throw new Error('Error seeding user, name length is too small');
        }
        if (accountName.length > APPConstants.USER_NAME_MAX_LENGTH) {
            throw new Error('Error seeding user, name length is too large');
        }

        if (pass.length < APPConstants.USER_PASSWORD_MIN_LENGTH) {
            throw new Error('Error seeding user, password length is too small');
        }
        if (pass.length > APPConstants.USER_PASSWORD_MAX_LENGTH) {
            throw new Error('Error seeding user, password length is too large');
        }
    }

    /**
     * Crea un usuario en SQL usando los datos pasados por param. Este método
     * ignora la lógica de verificación y añade los usuarios directamente en la
     * tabla de users.
     *
     * @param accountName   Nombre de la cuenta (no correo)
     * @param pass          Contraseña sin hashear del usuario
     * @param role          Role para el usuario
     */
    async createSqlUser(accountName: string, pass: string, role: Role) {
        const user: User = new User();
        const companyDomain = this.getEnvVar('COMPANY_DOMAIN');
        user.mail = `${accountName.toLowerCase()}@${companyDomain.toLowerCase()}.es`;

        const existingUser = await this.userRepository.findOneBy({
            mail: user.mail,
        });

        // Si existe el usuario que se quiere crear, se salta
        if (existingUser) {
            this.logger.debug(`SQL: User ${accountName} already exists`);
        } else {
            user.name = accountName;
            user.role = role;
            user.password = pass;

            await this.userRepository.save(user);
            this.logger.debug(`SQL: User ${accountName} created`);
        }
    }
}
