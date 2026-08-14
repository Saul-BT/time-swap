import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Company } from 'src/company/entities/company.entity';
import { UserCompany } from 'src/company/entities/user-company.entity';
import { CompanyRole } from 'src/company/enums/company-role.enum';
//import FileService from 'src/files/services/file-service.service';
import { Role, User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import type { StreamableFile } from '@nestjs/common';
import { ErrorManager } from 'src/common/error-handling/error.manager';
//import { I18nService } from 'nestjs-i18n';
import { APPConstants } from 'src/common/constants/app-constants';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class SeederService {
    /**
     * Objeto para realizar logs en la consola cuando el seeder realiza operaciones
     */
    private readonly logger = new Logger(SeederService.name);

    // Rutas de las imagenes
    private readonly DEFAULT_LOGO_PATH = path.join(process.cwd(), 'assets', 'img', APPConstants.DEFAULT_LOGO_IMG);

    private getEnvVar(key: string, fallback = ''): string {
        const value = process.env[key];
        if (value === undefined || value === null) {
            if (!fallback) {
                this.logger.warn(`Environment variable ${key} is not defined. Using fallback value.`);
            }
            return fallback;
        }
        return value;
    }

    constructor(
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

    async seed() {
        await this.seedBucketsMinIO(true);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await this.setDefaultPolicyBuckets(true);

        await this.seedDefaultImages(true);
        await this.seedUsers(true);
        await this.seedTicket(true);
        await this.seedCompany(true);
    }

    /**
     * Método para añadir los buckets a MinIO de los enums FileBuckets y DocumentsBuckets.
     *
     * @returns     El return se usa para romper la lógica en caso de estar en producción
     */
    async seedBucketsMinIO(force: boolean = false) {
        if (force) {
            try {
                this.logger.debug('Seeding Buckets in MinIO');
                const allBuckets: string[] = Object.values(FileBuckets);
                for (const bucket of allBuckets) {
                    this.logger.debug(`Seeding bucket ${bucket} into MinIO`);
                    await this.fileService.createBucket(bucket);
                }
            } catch (error) {
                this.logger.error(error);
            }
        }
    }

    /**
     * Método que cambia la politica de los buckets y los hace publicos
     *
     * @returns     El return se usa para romper la lógica en caso de estar en producción
     */
    async setDefaultPolicyBuckets(force: boolean = false) {
        if (force) {
            try {
                await this.fileService.makeBucketPublic(FileBuckets.PUBLIC_BUCKET);
            } catch (error) {
                this.logger.error(error);
            }
        }
    }

    async seedDefaultImages(force = false) {
        if (force) {
            try {
                // Verificar si las imágenes ya existen
                const logoExist = await this.fileService.fileExists(FileBuckets.PUBLIC_BUCKET, [
                    APPConstants.DEFAULT_LOGO_IMG,
                ]);

                if (!logoExist) {
                    try {
                        // Leer el archivo del sistema de archivos
                        const imageBuffer = fs.readFileSync(this.DEFAULT_LOGO_PATH);

                        // Subir a MinIO
                        await this.fileService.uploadFile(
                            FileBuckets.PUBLIC_BUCKET,
                            [APPConstants.DEFAULT_LOGO_IMG],
                            imageBuffer,
                            'image/png',
                            false,
                        );
                    } catch (error: unknown) {
                        const message = error instanceof Error ? error.message : 'Unexpected error';
                        this.logger.error(`Error uploading default logo image: ${message}`);
                    }
                }
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Unexpected error';
                this.logger.error(`Error seeding default images: ${message}`);
            }
        }
    }

    async getDefaultLogoFile(): Promise<StreamableFile> {
        try {
            return await this.fileService.retrieveFileByPath(
                FileBuckets.PUBLIC_BUCKET,
                [APPConstants.DEFAULT_LOGO_IMG],
                false,
            );
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unexpected error';
            this.logger.error(`Error getting default logo: ${message}`);
            throw new ErrorManager('NOT_FOUND', this.i18n.t('error.FILE.DEFAULT_LOGO_NOT_FOUND'));
        }
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

    async seedTicket(force: boolean = false) {
        if (force) {
            try {
                this.logger.debug('Seeding tickets');
                if (process.env.NODE_ENV === 'production') return;

                // Se crea un usuario para pasar por el correo para el ticket
                const accountName = Role.USER.toString();
                const companyDomain = this.getEnvVar('COMPANY_DOMAIN');
                const mail = `${accountName.toLowerCase()}@${companyDomain.toLowerCase()}.es`;

                const user = await this.userRepository.findOneBy({
                    mail: mail,
                });

                if (!user) {
                    this.logger.debug(`No user with email ${mail} and USER role found`);
                    return;
                }

                // Crea 6 tickets con diferentes categorias
                const ticketData = [
                    { title: 'Help with company setup', category: TicketCategory.COMPANY, notes: 0 },
                    { title: 'Dashboard not loading correctly', category: TicketCategory.DASHBOARD, notes: 0 },
                    { title: 'Need assistance with asset inventory', category: TicketCategory.ASSET, notes: 1 },
                    { title: 'Alert configuration issue', category: TicketCategory.ALERTS, notes: 1 },
                    { title: 'General question about the platform', category: TicketCategory.OTHER, notes: 2 },
                    { title: 'Problem with user permissions', category: TicketCategory.USER, notes: 4 },
                ];

                for (const data of ticketData) {
                    // comprobar si el ticket ya existe
                    const existingTicket = await this.ticketRepository.findOneBy({
                        title: data.title,
                        user: { id: user.id },
                    });

                    if (existingTicket) {
                        this.logger.debug(`Ticket "${data.title}" already exists for user ${user.name}`);
                        continue;
                    }

                    // Aqui se crea el ticket
                    const newTicket = new Ticket();
                    newTicket.title = data.title;
                    newTicket.category = data.category;
                    newTicket.status = TicketStatus.OPEN;
                    newTicket.user = user;
                    newTicket.notes = [];

                    // Crear notas y añadirlas al ticket
                    if (data.notes > 0) {
                        for (let i = 0; i < data.notes; i++) {
                            const ticketNote = new TicketNote();
                            ticketNote.text = `Note ${i + 1} for ticket: ${data.title}`;
                            ticketNote.createdBy = user;
                            ticketNote.ticket = newTicket;

                            // Añadir la nota al array de notas del ticket
                            newTicket.notes.push(ticketNote);
                        }
                    }

                    // Guardar el ticket con sus notas
                    await this.ticketRepository.save(newTicket);

                    this.logger.debug(`Created ticket "${data.title}" for user ${user.name} with ${data.notes} notes`);
                }

                this.logger.debug('Finished seeding tickets');
            } catch (error) {
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

            // Crear sección de minio del usuario para todos los buckets de documentos y archivos
            // @TODO no hace falta crear la seccion de un usuario en cada bucket
            //const userPath = this.fileService.getUserPath(userData.id, userData.mail);
            //await this.fileInitService.createPathInAllBuckets([userPath]);
        }
    }
}
