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
import { CategoryRequest } from 'src/category/entities/category-request.entity';
import { Category } from 'src/category/entities/category.entity';
import { Listing } from 'src/listing/entities/listing.entity';
import { ListingKind } from 'src/listing/enums/listing-kind.enum';
import { ListingMode } from 'src/listing/enums/listing-mode.enum';
import { ListingStatus } from 'src/listing/enums/listing-status.enum';

@Injectable()
export class SeederService {
    /**
     * Objeto para realizar logs en la consola cuando el seeder realiza operaciones
     */
    private readonly logger = new Logger(SeederService.name);

    private static readonly SEEDED_CATEGORIES = ['category 1', 'category 2', 'category 3'];

    constructor(
        private readonly configService: ConfigService, //for reading .env values
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(UserCompany)
        private readonly userCompanyRepository: Repository<UserCompany>,
        @InjectRepository(CategoryRequest)
        private readonly requestRepository: Repository<CategoryRequest>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Listing)
        private readonly listingRepository: Repository<Listing>,
    ) {}

    getEnvVar(key: string): string {
        let value: string|undefined = this.configService.get(key);
        return value != undefined? value : '';
    }

    async seed() {
        await this.seedUsers();
        await this.seedCompany();
        await this.seedCategories();
        await this.seedListings();
    }

    /**
     * Método para añadir usuarios a la base de datos. Se crea un usuario por cada permiso
     * que se encuentre en el ENUM de Role. El dominio viene establecido en el .env y la
     * contraseña se monta usando el nombre del rol y unos valores del .env
     *
     * @returns     El return se usa para romper la lógica en caso de estar en producción
     */
    async seedUsers() {
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
                const password = seededUsersPass;
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

    async seedCompany() {
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

            this.logger.debug(`Company ${companyName} created and associated with user ${user.name}`);
        } catch (error) {
            this.logger.error(error);
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
    async createSqlUser(accountName: string, pass: string, role: Role): Promise<boolean> {
        const user: User = new User();
        const companyDomain = this.getEnvVar('COMPANY_DOMAIN');
        user.mail = `${accountName.toLowerCase()}@${companyDomain.toLowerCase()}.es`;

        const existingUser = await this.userRepository.findOneBy({
            mail: user.mail,
        });

        // Si existe el usuario que se quiere crear, se salta
        if (existingUser) {
            this.logger.debug(`SQL: User ${accountName} already exists`);
            return false;
        } else {
            user.name = accountName;
            user.nickname = accountName;
            user.role = role;
            user.password = pass;

            await this.userRepository.save(user);
            this.logger.debug(`SQL: User ${accountName} created`);
            return true;
        }
    }

    async seedCategories() {
        try {
            this.logger.debug('Seeding categories');
            if (process.env.NODE_ENV === 'production') return;

            const accountName = Role.USER;
            const companyDomain = this.getEnvVar('COMPANY_DOMAIN');
            const mail = `${accountName.toLowerCase()}@${companyDomain.toLowerCase()}.es`;

            const user = await this.userRepository.findOneBy({
                mail: mail,
            });
            if (!user)
                throw error('Seeding user ' + mail + ' not found');

            const seededRequests = ['request 1', 'request 2', 'request 3'];
            for (const name of seededRequests) {
                const requestName = name.trim().toLowerCase();
                let existingRequest = await this.requestRepository.findOneBy({
                    name: requestName
                });
                if (existingRequest) {
                    this.logger.debug(`Request ${requestName} already exists`);
                    continue;
                }

                const newRequest = new CategoryRequest();
                newRequest.name = requestName;
                newRequest.description = requestName;
                newRequest.voters = [user];
                await this.requestRepository.save(newRequest);

                existingRequest = await this.requestRepository.findOneBy({
                    name: requestName
                });
                if (!existingRequest)
                    throw error('Seeding request ' + requestName + ' not found');
            }

            for (const name of SeederService.SEEDED_CATEGORIES) {
                const categoryName = name.trim().toLowerCase();
                let existingCategory = await this.categoryRepository.findOneBy({
                    name: categoryName
                });
                if (existingCategory) {
                    this.logger.debug(`Category ${categoryName} already exists`);
                    continue;
                }

                const newCategory = new Category();
                newCategory.name = categoryName;
                newCategory.description = categoryName;
                await this.categoryRepository.save(newCategory);

                existingCategory = await this.categoryRepository.findOneBy({
                    name: categoryName
                });
                if (!existingCategory)
                    throw error('Seeding category ' + categoryName + ' not found');
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    async seedListings() {
        try {
            this.logger.debug('Seeding listings');

            const existingListing = await this.listingRepository.findOneBy({ title: 'Listing 1' });
            if (existingListing) {
                this.logger.debug('Listings already seeded, skipping...');
                return;
            }

            const accountName = Role.USER;
            const companyDomain = this.getEnvVar('COMPANY_DOMAIN');
            const mail = `${accountName.toLowerCase()}@${companyDomain.toLowerCase()}.es`;

            const user = await this.userRepository.findOneBy({
                mail: mail,
            });
            if (!user)
                throw error('Seeding user ' + mail + ' not found');
            
            const category = await this.categoryRepository.findOneBy({ name: SeederService.SEEDED_CATEGORIES[0] });
            if (!category)
                throw error('Seeding category ' + SeederService.SEEDED_CATEGORIES[0] + ' not found');
            
            const listingData = this.listingRepository.create();
            listingData.title = 'Listing 1';
            listingData.description = 'Example seeded listing 1';
            listingData.kind = ListingKind.OFFER;
            listingData.mode = ListingMode.REMOTE;
            listingData.category = category;
            listingData.startDateTime = new Date('2027-01-01');
            listingData.duration = '1h';
            listingData.location = 'Seeded location';
            listingData.author = user;

            //create one for each status
            const listingActive = this.listingRepository.create({
                ...listingData,
                status: ListingStatus.ACTIVE,
            });

            await this.listingRepository.save(listingActive);

            const listingPaused = this.listingRepository.create({
                ...listingData,
                status: ListingStatus.PAUSED,
                cancelledTime: new Date(),
            });

            await this.listingRepository.save(listingPaused);

            const listingWithdrawn = this.listingRepository.create({
                ...listingData,
                status: ListingStatus.WITHDRAWN,
                completedTime: new Date(),
            });

            await this.listingRepository.save(listingWithdrawn);

            const listingCompleted = this.listingRepository.create({
                ...listingData,
                status: ListingStatus.COMPLETED,
                completedTime: new Date(),
            });

            await this.listingRepository.save(listingWithdrawn);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
