import { forwardRef, Inject, Injectable, Logger, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import mime from 'mime-types';
//import { I18nService } from 'nestjs-i18n';
import { EntityManager, FindOptionsOrder, FindOptionsOrderValue, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ErrorManager } from '../common/error-handling/error.manager';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { UserService } from '../user/user.service';
import { AddUserDTO } from './dto/add-user.dto';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { DelegateCompanyDTO } from './dto/delegate.dto';
import { RemoveUserDTO } from './dto/remove-user.dto';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { UpdateUserCompanyDTO } from './dto/update-user.dto';
import { Company } from './entities/company.entity';
import { UserCompany } from './entities/user-company.entity';
import { CompanyRole } from './enums/company-role.enum';
import { AddUserCompanyOutputDTO } from './outputs/add-user.output.dto';
import { CreateCompanyOutputDTO } from './outputs/create-company.output.dto';
import { DelegateCompanyOutputDTO } from './outputs/delegate.output.dto';
import { DeleteCompanyOutputDTO } from './outputs/delete-company.output.dto';
import { CompanyInfoOutputDTO } from './outputs/info.output.dto';
import { CompanyInfoDTO, LastOwnerOutputDTO } from './outputs/last-owner.output.dto';
import { LeaveCompanyOutputDTO } from './outputs/leave.output.dto';
import { RemoveUserCompanyOutputDTO } from './outputs/remove-user.output.dto';
import { UpdateCompanyOutputDTO } from './outputs/update-company.output.dto';
import { UpdateUserCompanyOutputDTO } from './outputs/update-user.output.dto';
import { PaginatedResponse } from 'src/common/dtos/paginated.dto';
import { CompanyDTO } from './outputs/all-info.output.dto';
import { OrderCompany } from './enums/order-company.enum';
//import { SeederService } from 'src/seeder/seeder.service';
import { APPConstants } from 'src/common/constants/app-constants';
import { OrderDTO } from 'src/common/dtos/order.dto';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class CompanyService {
    private readonly logger = new Logger(CompanyService.name);

    /**
     * Constructor del servicio, las compañías usan i18n para multilenguaje y el servicio de
     * usuarios para relaciones. También usa minio para almacenar datos de la compañía
     * como puede ser el logo. El EntityManager se usa para transacciones con la base de datos
     * y comprobaciones de seguridad.
     *
     * @param companyRepository         Entidad de la BD para las compañías.
     * @param userCompanyRepository     Entidad de la BD para las relaciones entre compañías y usuarios.
     * @param userService               Servicio con el CRUD de usuarios, para las relaciones.
     * @param i18n                      Servicio multilenguaje (principalmente para errores).
     * @param entityManager             Manager para transacciones en la base de datos
     */
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(UserCompany)
        private readonly userCompanyRepository: Repository<UserCompany>,
        //private readonly i18n: I18nService<I18nTranslations>,
        private readonly entityManager: EntityManager,
        //private readonly seederService: SeederService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    /**
     * Método para crear una compañía, esté método tiene amplias protecciones que pueden ser
     * revisadas dependiendo de las clausulas de seguridad que se quieran aplicar.
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param companyInfo   Objeto de tipo CreateCompanyDTO con los datos de la compañía a crear.
     * @returns             Objeto de tipo CreateCompanyOutputDTO con los datos de la compañía creada, el dato más
     *                      importante es el ID. Puede arrojar diferentes errores de tipo CONFLICT o procedentes del
     *                      ORM a la hora de crear la entrada en la base de datos.
     */
    async createCompany(userInfo: UserActiveInterface, companyInfo: CreateCompanyDTO) {
        // Primero comprobar si ya existe la empresa. Si existe, lanzar error
        const existing = await this.companyRepository.findOneBy({
            name: companyInfo.company_name,
        });
        if (existing) throw new ErrorManager('CONFLICT', 'COMPANY EXISTS');

        // Crear un QueryRunner para manejar la transacción
        const queryRunner = this.entityManager.dataSource.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            // Guardar la nueva compañía
            const savedCompany = await queryRunner.manager.save(Company, {
                name: companyInfo.company_name,
            });

            // Recuperamos el objeto compañía para guardarlo en la relación
            const company = await queryRunner.manager.findOneBy(Company, {
                name: companyInfo.company_name,
            });
            if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT FOUND');

            // Recuperamos el usuario
            const user = await this.userService.findByMail(userInfo.mail);
            if (!user) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

            // Guardamos la relación
            await queryRunner.manager.save(UserCompany, {
                user: user,
                company: company,
                companyRole: CompanyRole.OWNER,
            });

            // Nombre de la sección de la compañía
            // @TODO No es necesario añadir una seccion de compañia en cada bucket
            // const companyPathName = this.fileService.getCompanyPath(company.id, company.name);
            // await this.fileInitService.createPathInAllBuckets([companyPathName]);
            /**
             * @TODO Añadir una imagen por defecto para el logo de empresa si se requiere
             */

            // Commit de la transacción
            await queryRunner.commitTransaction();

            // Devolver objeto de tipo CreateCompanyOutputDTO con los datos relevantes al front
            return {
                company_name: savedCompany.name,
                id: savedCompany.id,
                createdAt: savedCompany.createdAt,
            } as CreateCompanyOutputDTO;
        } catch (error) {
            /**
             * En caso de algún error en cualquier paso de la creación de la empresa, no
             * guardaremos los datos en MySQL. De esta forma evitamos tener una mala sincronización
             * entre minio y otras bases de dato.
             */
            await queryRunner.rollbackTransaction();

            // Gestionar posibles errores del ORM con MySQL o errores de minio
            throw new ErrorManager('BAD_REQUEST', 'COMPANY CREATE FAILED');
        } finally {
            // Liberar el query runner
            await queryRunner.release();
        }
    }

    /**
     * Método para borrar una compañía. La lógica comprueba diferentes párametros de seguridad siendo el más
     * importante que el usuario que lanza el método debe ser dueño (OWNER) de la compañía.
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param id            ID de la compañía que borrar
     * @returns             Un objeto de tipo DeleteCompanyOutputDTO o diferentes errores dependiendo del tipo
     *                      de CONFLICT que pueda ocurrir durante el proceso.
     */
    async deleteCompany(userInfo: UserActiveInterface, id: number) {
        // Recuperar la compañían para comprobar si existe
        const company = await this.companyRepository.findOneBy({
            id: id,
        });

        // Si no existe, devolver error
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');

        // Recuperar el usuario que lanza el método para ver si es dueño de la compañía
        const adminUser = await this.userService.findByMail(userInfo.mail);
        if (adminUser === null) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

        // Recuperar la relación del usuario con la compañía
        const adminRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: adminUser.id },
            },
        });

        // Si no es dueño (OWNER), lanzar error
        if (adminRelation === null || adminRelation.companyRole != CompanyRole.OWNER) {
            throw new ErrorManager('CONFLICT', 'COMPANY NOT OWNER');
        }

        // Recuperar TODAS las relaciones de usuarios con la compañía que se va a borrar
        const userCompanies = await this.userCompanyRepository.find({
            where: {
                company: { id: company.id },
            },
        });

        // Iniciar QueryRunner para seguridad en la transacción
        const queryRunner = this.entityManager.dataSource.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            /**
             * Primero debemos borrar todas las relaciones de los usuarios con la compañía,
             * debido a la relación que existe de dependencia entre la tabla user_companies y
             * la tabla company, no podremos borrar una compañía si hay al menos un usuario
             * dentro. Una vez borradas todas las relaciones, borramos la compañía.
             */
            await queryRunner.manager.remove(userCompanies);
            await queryRunner.manager.remove(company);

            // Confirmar la transacción
            await queryRunner.commitTransaction();

            return {
                company_name: company.name,
                createdAt: company.createdAt,
                deleted: true,
            } as DeleteCompanyOutputDTO;
        } catch (error) {
            /**
             * En caso de algún error durante el proceso, no se borrarán las tablas de MySQL, es posible
             * que si se borren los datos de minio y no de MySQL, pero dada la casuística del código
             * sería muy raro que eso ocurriese. Se debe testear el método una vez introducida la lógica
             * completa del programa.
             */
            await queryRunner.rollbackTransaction();

            // Gestionar posibles errores del ORM por parte de MySQL como errores de minio
            throw new ErrorManager('BAD_REQUEST', 'COMPANY DELETE FAILED');
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Método para actualizar la información de una empresa ya existente. En caso de añadir nuevos
     * datos a la empresa que puedan ser actualizados (como una descripción) se debe modificar siempre
     * este método para adaptar la posibilidad de modificación así como los DTO de entrada y salida
     * relacionados con este método.
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param companyId     ID de la compañía que queremos actualizar.
     * @param info          Objeto de tipo UpdateCompanyDTO con todos los datos que se van a actualizar en
     *                      la compañía.
     * @returns             Objeto de tipo UpdateCompanyOutputDTO con los datos relevantes de la empresa. Por
     *                      recomendación, se devolverán todos los datos, se hayan actualizado o no, para que
     *                      el front pueda gestionar más fácilmente la información.
     */
    async updateCompany(userInfo: UserActiveInterface, companyId: number, info: UpdateCompanyDTO) {
        // Recuperar la compañía
        const company = await this.companyRepository.findOneBy({
            id: companyId,
        });

        // Si no existe la compañía, devolver error
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');

        // Recuperar al usuario que lanza el método
        const adminUser = await this.userService.findByMail(userInfo.mail);
        if (adminUser === null) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

        // Recuperar la relación del usuario con la compañía
        const adminRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: adminUser.id },
            },
        });

        // Solo los dueños y administradores (OWNER y ADMIN) pueden realizar la actualización
        if (adminRelation === null || (adminRelation.companyRole != CompanyRole.ADMIN && adminRelation.companyRole != CompanyRole.OWNER)) {
            throw new ErrorManager('CONFLICT', 'COMPANY NOT ADMIN');
        }

        /**
         * Se declaran diferentes valores extraidos del objeto info que ha entrado como
         * parámetro al método para sacar las variables que, quizás, se deban actualizar.
         */
        const { new_company_name } = info;

        // Comprobar si existe un nuevo nombre y debemos actualizar
        if (new_company_name !== undefined) {
            // Comprobamos si ya existe alguna compañía con el nuevo nombre
            const new_name_company = await this.companyRepository.findOneBy({
                name: new_company_name,
            });

            // Si ya existe algo con el nuevo nombre, devolvemos un error
            if (new_name_company) throw new ErrorManager('CONFLICT', 'COMPANY EXISTS');

            // Cambiar el nombre de la compañía para actualizar el objeto en MySQL
            if (info.new_company_name !== undefined)
                company.name = info.new_company_name;
        }

        // Actualizar el objeto usando el ORM, todos los datos nuevos sobrescribirán a los antiguos
        await this.companyRepository.save(company);

        return {
            company_name: company.name,
            id: company.id,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt,
        } as UpdateCompanyOutputDTO;
    }

    /**
     * Añade un usuario a una compañía creando una relación en la tabla user_company.
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param companyId     ID de la compañía a la que añadir al usuario.
     * @param info          Objeto de tipo AddUserDTO con los datos del nuevo usuario que añadir a la compañía.
     * @returns             Objeto de tipo AddUserCompanyOutputDTO con todos los datos tanto de la compañía como
     *                      del usuario que acaba de ser añadido. O diferentes tipos de errores.
     */
    async addUserToCompany(userInfo: UserActiveInterface, companyId: number, info: AddUserDTO) {
        // Recuperar la compañía
        const company = await this.companyRepository.findOneBy({
            id: companyId,
        });

        // Si no existe, devolver un error
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');

        // Recuperar al usuario que lanza el método
        const adminUser = await this.userService.findByMail(userInfo.mail);
        if (adminUser === null) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

        // Comprobar si el usuario se encuentra en la compañía
        const adminRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: adminUser.id },
            },
        });

        // Solo los duseños y los administradores (OWNER y ADMIN) pueden añadir usuarios
        if (adminRelation === null || (adminRelation.companyRole != CompanyRole.ADMIN && adminRelation.companyRole != CompanyRole.OWNER)) {
            throw new ErrorManager('CONFLICT', 'COMPANY NOT ADMIN');
        }

        // Buscar al usuario que se va a añadir
        const user = await this.userService.findByMail(info.mail);

        if (!user) {
            /**
             * @TODO Por defecto, si el usuario no existe, simplemente se devolverá un error. Pero se
             * puede programar un "sistema de invitaciones" para generar una verificación pendiente
             * para un usuario que, al registrarse en la plataforma, le meterá directamente en la
             * compañía desde la que se le invitó.
             */
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        // Comprobar si el usuario no está ya en la compañía
        const existingRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: user.id },
            },
        });

        // Si ya está, devolver un error
        if (existingRelation) throw new ErrorManager('CONFLICT', 'USER ALREADY IN COMPANY');

        // Comprobación para asegurarse que solo los dueños añaden otros dueños
        if (info.role == CompanyRole.OWNER && adminRelation.companyRole == CompanyRole.ADMIN)
            throw new ErrorManager('CONFLICT', 'NOT OWNER INVITES OWNER');

        // Crear la nueva relación y guardarla
        const added = await this.userCompanyRepository.save({
            user: user,
            company: company,
            companyRole: info.role,
        });

        return {
            company_name: added.company.name,
            new_user_mail: user.mail,
            new_user_name: user.name,
            new_user_role: added.companyRole,
            createdAt: added.createdAt,
            added: true,
        } as AddUserCompanyOutputDTO;
    }

    /**
     *
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param companyId     ID de la compañía de la que retirar al usuario.
     * @param info          Objeto de tipo RemoveUserDTO con los datos del usuario a retirar.
     * @returns             Objeto de tipo RemoveUserCompanyOutputDTO con todos los datos relevantes tanto de la
     *                      compañía como del usuario borrado. O diferentes tipos de errores.
     */
    async removeUserFromCompany(userInfo: UserActiveInterface, companyId: number, info: RemoveUserDTO) {
        // Recuperar la compañía
        const company = await this.companyRepository.findOneBy({
            id: companyId,
        });

        // Si no existe, devolver error
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');

        // Recuperar la relación del usuario con la compañía
        const adminUser = await this.userService.findByMail(userInfo.mail);
        if (adminUser === null) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

        const adminRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: adminUser.id },
            },
        });

        // Solo los dueños y administradores (OWNER y ADMIN) pueden borrar usuarios
        if (!adminRelation || (adminRelation.companyRole != CompanyRole.ADMIN && adminRelation.companyRole != CompanyRole.OWNER)) {
            throw new ErrorManager('CONFLICT', 'COMPANY NOT ADMIN');
        }

        // Recuperar la información del usuario que se quiere añadir
        const user = await this.userService.findByMail(info.mail);

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        // Comprobar si el usuario nuevo ya está en la empresa
        const existingRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: user.id },
            },
        });

        if (!existingRelation) throw new ErrorManager('CONFLICT', 'USER NOT COMPANY');

        if (existingRelation.companyRole == CompanyRole.OWNER)
            throw new ErrorManager('CONFLICT', 'USER IS OWNER');

        // Guardar la relación nueva
        const result = await this.userCompanyRepository.remove(existingRelation);

        return {
            company_name: company.name,
            new_user_mail: user.mail,
            new_user_name: user.name,
            createdAt: result.createdAt,
            deleted: true,
        } as RemoveUserCompanyOutputDTO;
    }

    /**
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param companyId     ID de la compañía sobre la que actualizar el usuario.
     * @param info          Objeto de tipo UpdateUserCompanyOutputDTO con datos relevantes tanto de la compañía
     *                      como del usuario que se ha actualizado. O diferentes tipos de errores.
     * @returns
     */
    async updateUserInCompany(userInfo: UserActiveInterface, companyId: number, info: UpdateUserCompanyDTO) {
        // Recuperar la compañía
        const company = await this.companyRepository.findOneBy({
            id: companyId,
        });

        // Si la compañía no existe, devolver un error
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');

        // Recuperar la relación del usuario que lanza el servicio
        const adminUser = await this.userService.findByMail(userInfo.mail);
        if (adminUser === null) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

        const requesterRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: adminUser.id },
            },
        });

        // Solo los dueños y los administradores (OWNER y ADMIN) pueden modificar los datos
        if (!requesterRelation || (requesterRelation.companyRole != CompanyRole.ADMIN && requesterRelation.companyRole != CompanyRole.OWNER)) {
            throw new ErrorManager('CONFLICT', 'NOT ADMIN');
        }

        // Recuperar el usuario a modificar
        const user = await this.userService.findByMail(info.mail);

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        // Comprobar que el usario a modificar está en la compañía
        const existingRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: user.id },
            },
        });

        if (!existingRelation) throw new ErrorManager('CONFLICT', 'USER NOT IN COMPANY');

        /**
         * La lógica no permite cambiar el rol de un dueño (OWNER) de compañía. Si un dueño quiere dejar
         * de serlo, debe usar el endpoint de delegar sobre otro usuario.
         */
        if (!existingRelation || existingRelation.companyRole == CompanyRole.OWNER)
            throw new ErrorManager('CONFLICT', 'USER IS OWNER');

        /**
         * Comprobar si se está dando rol de dueño (OWNER) a alguien y, quien lo da, no es dueño.
         * Solo un dueño puede nombrar a otros dueños.
         */
        if (!requesterRelation || (requesterRelation.companyRole != CompanyRole.OWNER && info.new_role == CompanyRole.OWNER))
            throw new ErrorManager('CONFLICT', 'COMPANY NOT OWNER');

        /**
         * Declarar variables para los nuevos datos, comprobar si están iniciados y asignarlos a la entidad
         * que luego se guardará en el ORM.
         *
         * En caso de añadir nuevos datos a la entidad, se debe añadir aquí la actualización.
         */
        if (info.new_role) existingRelation.companyRole = info.new_role;

        await this.userCompanyRepository.save(existingRelation);

        return {
            company_name: company.name,
            user_mail: user.mail,
            user_name: user.name,
            role: info.new_role ?? requesterRelation.companyRole,
            updatedAt: existingRelation.updatedAt,
        } as UpdateUserCompanyOutputDTO;
    }

    /**
     * Método para que un usuario abandone una compañía. Se realizan diferentes comprobaciones de seguridad,
     * siendo la más importante que un usuario dueño (OWNER) no puede dejar una compañía en la que se encuentre.
     * Si un usuario dueño quiere hacerlo, primero debe delegar en otro usuario el control de la compañía. Con
     * esto, dejará de ser dueño y pasará a ser administrador (ADMIN). Momento en el que ya podrá abandonar la
     * compañía.
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param companyId     ID de la compañía de la que el usuario quiere retirarse.
     * @returns             Objeto de tipo LeaveCompanyOutputDTO con los datos relevantes de la compañía de la
     *                      que el usuario se ha retirado y si ha logrado retirarse satisfactoriamente. O
     *                      errores de diferentes tipos.
     */
    async leaveCompany(userInfo: UserActiveInterface, companyId: number) {
        // Recuperar la compañía
        const company = await this.companyRepository.findOneBy({
            id: companyId,
        });

        // Si no existe, devolver error
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');

        // Recuperar la relación del usuario con la compañía
        const existingRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: userInfo.id },
            },
        });

        if (!existingRelation) throw new ErrorManager('CONFLICT', 'USER NOT IN COMPANY');

        // Si el usuario es dueño (OWNER), devolver error
        if (existingRelation.companyRole == CompanyRole.OWNER)
            throw new ErrorManager('CONFLICT', 'USER IS OWNER');

        // Borrar la relación
        await this.userCompanyRepository.remove(existingRelation);

        return {
            company_name: company.name,
            user_mail: userInfo.mail,
            leave: true,
        } as LeaveCompanyOutputDTO;
    }

    /**
     * Método que permite a un usuario dueño (OWNER) de una compañía pasar el control del rol a otro usuario.
     * El usuario que antes era dueño de la compañía ahora será administrador (ADMIN).
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param companyId     ID de la compañía sobre la que hacer las gestiones
     * @param info          Objeto de tipo DelegateCompanyDTO con los datos relevantes de la gestión
     * @returns             Objeto de tipo DelegateCompanyOutputDTO con los datos relevantes de la compañía y de
     *                      los dos usuarios relevantes en la gestión. O diferentes tipos de errores.
     */
    async delegateOwner(userInfo: UserActiveInterface, companyId: number, info: DelegateCompanyDTO) {
        // Recupera la compañía
        const company = await this.companyRepository.findOneBy({
            id: companyId,
        });

        // Si no existe, devolver error
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');

        // Recuperar la relación del usuario con la compañía
        const adminUser = await this.userService.findByMail(userInfo.mail);
        if (adminUser === null) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

        const adminRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: adminUser.id },
            },
        });

        // Si el usuario no es dueño (OWNER), devolver error
        if (!adminRelation || adminRelation.companyRole != CompanyRole.OWNER) {
            throw new ErrorManager('CONFLICT', 'COMPANY NOT OWNER');
        }

        // Recuperar al usuario que queremos transformar en dueño (OWNER)
        const user = await this.userService.findByMail(info.mail);

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        // Comprobar que el nuevo dueño esté en la compañía
        const newOwnerRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: user.id },
            },
        });

        if (!newOwnerRelation) throw new ErrorManager('CONFLICT', 'USER NOT IN COMPANY');

        // Recuperar la relación del antiguo dueño
        const oldOwnerRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: userInfo.id },
            },
        });

        if (!oldOwnerRelation) throw new ErrorManager('CONFLICT', 'USER NOT IN COMPANY');

        // Actualizar los roles
        newOwnerRelation.companyRole = CompanyRole.OWNER;
        oldOwnerRelation.companyRole = CompanyRole.ADMIN;

        await this.userCompanyRepository.save(oldOwnerRelation);
        const updateValues = await this.userCompanyRepository.save(newOwnerRelation);

        return {
            company_name: company.name,
            new_owner_mail: user.mail,
            new_owner_name: user.name,
            updatedAt: updateValues.updatedAt,
        } as DelegateCompanyOutputDTO;
    }

    /**
     * Método para obtener las opciones de ordenación de las compañías
     *
     * @param order  Array de objetos de tipo OrderDTO con la información de orden
     * @returns      Objeto de tipo FindOptionsOrder<Company> con las opciones de ordenación
     */
    private getCompanyOrderOptions(order: OrderDTO<OrderCompany>[]): FindOptionsOrder<Company> {
        const orderOptions: FindOptionsOrder<Company> = {};

        order.forEach((orderItem) => {
            const direction = orderItem.direction.toUpperCase() as FindOptionsOrderValue;
            if (orderItem.field === OrderCompany.REQUESTER_ROLE) {
                orderOptions.userCompanies = {
                    ...(orderOptions.userCompanies as FindOptionsOrder<UserCompany> | undefined),
                    companyRole: direction,
                };
            } else {
                orderOptions[orderItem.field] = direction;
            }
        });

        return orderOptions;
    }

    /**
     * Método para ver la información de todas las compañías que tiene un usuario. Para agilizar las gestiones
     * por parte de front, existe en rol requester_role fuera de la anidación de la lista de usuarios de cada
     * empresa donde se devolverá el rol del usuario que solicita información. Esto permite ahorrar costes y
     * tiempos para el front.
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @returns             Objeto de tipo AllCompanyInfoOutputDTO con toda la información de las compañías
     *                      que tiene el usuario.
     */
    async myCompaniesPaginated(
        userInfo: UserActiveInterface,
        page: number,
        pageSize: number,
        order: OrderDTO<OrderCompany>[],
        name?: string,
    ): Promise<PaginatedResponse<CompanyDTO>> {
        if (!page || !pageSize || page < 1 || pageSize < 1) {
            throw new ErrorManager('NOT_ACCEPTABLE', 'PAGESIZE INVALID');
        }
        const where: FindOptionsWhere<Company> = { userCompanies: { user: { id: userInfo.id } } }; // Solo compañia del usuario
        if (name) where.name = ILike(`%${name}%`); // Buscar por nombre si esta especificado

        const orderOption = this.getCompanyOrderOptions(order);

        const [companies, total] = await this.companyRepository.findAndCount({
            relations: { userCompanies: { user: true } },
            where,
            order: orderOption,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const formattedCompanies: CompanyDTO[] = await Promise.all(
            companies.map(async (company) => {
                const employees = company.userCompanies.map((uc) => ({
                    id: uc.user?.id ?? 0,
                    name: uc.user?.name ?? 'N/A',
                    mail: uc.user?.mail ?? 'N/A',
                    role: uc.companyRole,
                    added: uc.createdAt.toLocaleString(),
                }));

                const requesterRole =
                    company.userCompanies.find((uc) => uc.user.id === userInfo.id)?.companyRole ?? CompanyRole.USER;

                return {
                    id: company.id,
                    name: company.name,
                    createdAt: company.createdAt.toLocaleString(),
                    requester_role: requesterRole,
                    employees,
                } as CompanyDTO;
            }),
        );

        return {
            list: formattedCompanies,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    /**
     * Método para obtener la información paginada de las compañías y de todos sus usuarios.
     * Devuelve el mismo formato que allCompanies, pero con page, pageSize y total.
     *
     * @param userInfo    Usuario activo que realiza la petición
     * @param page        Número de página
     * @param pageSize    Tamaño de página
     * @returns           Objeto con estructura paginada: { page, pageSize, total, companies }
     */
    async getAllCompaniesPaginated(
        page: number,
        pageSize: number,
        order?: OrderDTO<OrderCompany>[],
        name?: string,
    ): Promise<PaginatedResponse<CompanyDTO>> {
        if (!page || !pageSize || page < 1 || pageSize < 1) {
            throw new ErrorManager('NOT_ACCEPTABLE', 'PAGESIZE INVALID');
        }

        let where: FindOptionsWhere<Company> = {};
        if (name) where = { name: ILike(`%${name}%`) }; // Buscar por nombre si esta especificado

        const orderOption = order ? this.getCompanyOrderOptions(order) : {};

        const [companies, total] = await this.companyRepository.findAndCount({
            relations: { userCompanies: { user: true } },
            where,
            order: orderOption,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const formattedCompanies: CompanyDTO[] = await Promise.all(
            companies.map(async (company) => {
                const employees = company.userCompanies.map((uc) => ({
                    id: uc.user.id,
                    name: uc.user.name ?? '',
                    mail: uc.user.mail,
                    role: uc.companyRole,
                    added: uc.createdAt.toLocaleString(),
                }));

                return {
                    id: company.id,
                    name: company.name,
                    createdAt: company.createdAt.toLocaleString(),
                    requester_role: CompanyRole.OWNER,
                    employees,
                };
            }),
        );

        return {
            list: formattedCompanies,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    /**
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @param companyId     ID de la compañía de la que recuperar la información.
     * @returns             Objeto de tipo CompanyInfoOutputDTO con la información de la compañía solicitada
     *                      o un error de tipo CONFLICT si no existe la compañía.
     */
    async companyInfo(userInfo: UserActiveInterface, companyId: number): Promise<CompanyInfoOutputDTO> {
        // Recuperar la información de la compañía
        const userCompany = await this.userCompanyRepository.findOne({
            where: { user: { id: userInfo.id }, company: { id: companyId } },
            relations: {
                company: {userCompanies: {user: true}}
            }
        });

        // Devolver un error si la compañía no existe
        if (!userCompany) {
            throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');
        }

        const company = userCompany.company;

        // Mapear datos al objeto respetando la estructura de CompanyInfoOutputDTO
        return {
            company: {
                name: company.name,
                id: company.id,
                createdAt: company.createdAt.toLocaleString(),
                requester_role: userCompany.companyRole,
                employees: company.userCompanies.map((uc) => ({
                    id: uc.user.id,
                    name: uc.user.name ?? '',
                    mail: uc.user.mail,
                    role: uc.companyRole,
                    added: uc.createdAt.toLocaleString(),
                }))
            },
        };
    }

    /**
     * Método que devuelve la cantidad de compañías que tiene un usuario, independientemente del rol que
     * tenga el usuario dentro de la compañía.
     *
     * @param userId        ID del usuario del que recuperar la información.
     * @returns             Valor de tipo number con la cantidad de compañías que tiene el usuario.
     */
    async totalCompanies(userId: number): Promise<number> {
        return this.userCompanyRepository.count({
            where: {
                user: {
                    id: userId,
                },
            },
        });
    }

    /**
     *
     * @param userId        ID del usuario del que borrar todas las relaciones.
     */
    async deleteCompanyRelation(userId: number) {
        /**
         * Se crea un objeto de tipo QueryRunner para asegurar las transacciones del ORM con SQL
         */
        const queryRunner = this.entityManager.dataSource.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            // Recuperar todas las relaciones del usuario en la tabla user_company
            const userCompanies = await queryRunner.manager.find(UserCompany, {
                where: { user: { id: userId } },
                relations: { company: true },
            });

            // Guardar un registro de las ID de las compañías que se están eliminando
            const companyIds = userCompanies.map((uc) => uc.company.id);

            // Eliminar las relaciones
            await queryRunner.manager.remove(UserCompany, userCompanies);

            // Bucle para comprobar si existen más relaciones para esas compañías
            for (const companyId of companyIds) {
                const remainingRelations = await queryRunner.manager.find(UserCompany, {
                    where: { company: { id: companyId } },
                });

                // Comprobar cuantos dueños (OWNER) quedan
                const hasOwner = remainingRelations.some((uc) => uc.companyRole === CompanyRole.OWNER);

                /**
                 * Si una compañías no tiene más usuarios dentro, debemos borrar la compañía
                 */
                if (remainingRelations.length === 0 || !hasOwner) {
                    // Si no hay más dueños (OWNER), eliminar todas las relaciones restantes
                    if (remainingRelations.length > 0) {
                        await queryRunner.manager.remove(UserCompany, remainingRelations);
                    }

                    await queryRunner.manager.delete(Company, companyId);
                }
            }

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Método que permite consultar las empresas de las cuales un usuario es el único dueño (OWNER) que queda
     * dentro. Devolverá un objeto de tipo LastOwnerOutputDTO con, primero, un valor boolean que es false si
     * no eres el único dueño de alguna compañía y true si lo eres. Luego, devolverá un array con información
     * relevante de todas las compañías de las cuales seas el único dueño.
     *
     * @param userInfo      Objeto de tipo UserActiveInterface con los datos del usuario que lanza el método.
     * @returns             Objeto de tipo LastOwnerOutputDTO con los datos relevantes del usuario y las compañías
     *                      a las que pertenece de las cual es el último dueño (OWNER).
     */
    async checkLastOwner(userInfo: UserActiveInterface): Promise<LastOwnerOutputDTO> {
        // Recuperar todas las relaciones del usuario con las compañías
        const userCompanies = await this.userCompanyRepository.find({
            where: {
                user: { id: userInfo.id },
                companyRole: CompanyRole.OWNER,
            },
            relations: {company: true},
        });

        // Iniciar el objeto de respuesta y el valor de "último dueño" a false
        const result: CompanyInfoDTO[] = [];
        let isLastOwner = false;

        /**
         * Recorrer el objeto de las relaciones, contar la cantidad de dueños (OWNER) que
         * hay dentro, pero con la condición de que el usuario que lanza el servicio sea
         * dueño. Si solo queda uno (el usuario que lanza el servicio) se sube la relación
         * al objeto de salida del servicio y se cambia el valor de "último dueño" a true
         * para indicar que si es el último dueño de, al menos, una compañía.
         */
        for (const userCompany of userCompanies) {
            const companyOwners = await this.userCompanyRepository.count({
                where: {
                    company: { id: userCompany.company.id },
                    companyRole: CompanyRole.OWNER,
                },
            });

            if (companyOwners === 1) {
                result.push({
                    companyId: userCompany.company.id,
                    companyName: userCompany.company.name,
                });
                isLastOwner = true;
            }
        }

        return {
            isLastOwner,
            companies: result,
        };
    }

    async checkUserInCompany(userInfo: UserActiveInterface, companyId: number): Promise<boolean> {
        // Recuperar la compañían para comprobar si existe
        const company = await this.companyRepository.findOneBy({
            id: companyId,
        });
        // Si no existe, devolver error
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');
        // Recuperar el usuario que lanza el método
        const adminUser = await this.userService.findByMail(userInfo.mail);
        if (adminUser === null) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        // Recuperar la relación del usuario con la compañía
        const adminRelation = await this.userCompanyRepository.findOne({
            where: {
                company: { id: company.id },
                user: { id: adminUser.id },
            },
        });
        // Comprobar si existe la relación
        if (!adminRelation) {
            return false;
        } else {
            return true;
        }
    }

    async getCompany(userInfo: UserActiveInterface, companyId: number) {
        if (await this.checkUserInCompany(userInfo, companyId)) {
            const company = await this.companyRepository.findOneBy({
                id: companyId,
            });
            return company;
        }
        return undefined;
    }

    async getCompanyNoChecking(companyId: number) {
        const company = await this.companyRepository.findOneBy({
            id: companyId,
        });
        return company;
    }

    public formatCompanyName(name: string): string {
        return name
            .toLowerCase()
            .replace(/\s+/g, '') // Elimina espacios en blanco
            .replace(/[^a-z0-9]/g, ''); // Mantiene solo caracteres alfanuméricos;
    }

    public async getCompanyFormatedName(id: number): Promise<string> {
        const company = await this.getCompanyNoChecking(id);
        if (!company) throw new ErrorManager('NOT_FOUND', 'COMPANY NOT EXISTS');
        return this.formatCompanyName(company.name);
    }
}
