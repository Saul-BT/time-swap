import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcrypt';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Verification } from '../auth/entities/verification.entity';
import { Role } from '../common/enums/role.enum';
import { ErrorManager } from '../common/error-handling/error.manager';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-pass.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TemporalOtp } from './entities/temporal-2fa.entity';
import { User } from './entities/user.entity';
import { Language } from './enums/language.enum';
import { AvatarOutput } from './interfaces/avatar.output.interface';
import { UserOutput } from './interfaces/user.output.interface';
import { AllUsersOutputDto, UserInfoDTO } from './dto-outputs/all-users.output.dto';
import { PaginatedResponse } from 'src/common/dtos/paginated.dto';
import { OrderUsers } from './enums/order-user.enum';
//import { I18nService } from 'nestjs-i18n';
import { LoginInterface } from 'src/auth/interfaces/login.interface';
import { CompanyService } from 'src/company/company.service';
import { AuthService } from 'src/auth/services/auth.service';
//import { SeederService } from 'src/seeder/seeder.service';
import { APPConstants } from 'src/common/constants/app-constants';
import { OrderDTO } from 'src/common/dtos/order.dto';
import { orderIntoFindOptions } from 'src/common/utils';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class UserService {
    /**
     * El constructur declara, mediante InjectRepository, las dos entidades de uso en los
     * métodos (User y Verification)
     *
     * @param userRepository        Entidad de usuarios
     * @param verifyRepository      Entidad de verificaciones
     */
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Verification)
        private readonly verifyRepository: Repository<Verification>,
        @InjectRepository(TemporalOtp)
        private readonly otpRepository: Repository<TemporalOtp>,
        //private readonly i18n: I18nService<I18nTranslations>,
        private readonly companyService: CompanyService,
        private readonly authService: AuthService,
        //private readonly seederService: SeederService,
    ) {}

    /**
     * Obtiene un usuario mediante la ID, oculta la contraseña para proteger ese
     * dato.
     *
     * @param id        ID del usuario para obtener la información
     * @returns         Objeto de tipo USER
     */
    async findById(id: number): Promise<Omit<User, 'password'> | null> {
        return await this.userRepository.findOneBy({ id: id });
    }

    /**
     * Obtiene el lenguaje almacenado de un usuario
     *
     * @param id        ID del usuario para obtener la información
     * @returns         Un valor del ENUm Language
     */
    async getUserLanguage(id: number): Promise<Language> {
        const user = await this.userRepository.findOneBy({ id: id });

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        return user.language;
    }

    /**
     * Crea un usuario nuevo en la base de datos con todos los datos proporcionados
     * en el DTO de entrada. La única validación que se hace por defecto es si ya existe
     * un correo asociado ya registrado. El DTO tiene un parámetro optativo llamado "role"
     * que normalmente no vendrá asignado. De ser así, se le asigna FREE. Este método
     * también crea un indice nuevo en open search usando de clave el email del usuario,
     * este indice es una copia de la plantilla definida en el init del módulo files.
     *
     * @param dto   DTO con la información del nuevo usuario
     * @returns     Devuelve el resultado del ORM al crear el usuario
     */
    async createUser(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findOneBy({ mail: dto.mail });

        if (user) throw new ErrorManager('CONFLICT', 'USER MAIL DUPLICATED');
        if (!dto.role) {
            dto.role = Role.USER;
        }

        const newUser = new User();
        newUser.mail = dto.mail;
        newUser.name = dto.name;
        newUser.password = dto.password;
        newUser.role = dto.role;
        newUser.language = dto.language ?? Language.EN;

        const fullResult = await this.userRepository.save(newUser);
        const { ...result } = fullResult;

        return result;
    }

    /**
     * Borra toda la información referente de un usuario en la base de datos. Por defecto los
     * datos que borrará serán de las tablas user y verification. Borrando tanto al usuario del
     * registro como todas sus invitaciones. No es posible borrar un usuario con el rol de
     * SUPER_ADMIN.
     *
     * @param mail      Un string con el mail del usuario
     * @returns         Devuelve el resultado del ORM al realizar el delete.
     */

    async deleteUser(mail: string): Promise<DeleteResult> {
        const user = await this.findByMail(mail);

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        if (user.role === Role.SUPER_ADMIN) {
            // Quitar este IF si se quiere permitir borrar SUPER_ADMIN

            throw new ErrorManager('FORBIDDEN', 'CANNOT DELETE SUPER_ADMIN');
        }

        try {
            await this.companyService.deleteCompanyRelation(user.id);
            await this.verifyRepository.delete({ targetEmail: mail });
            await this.otpRepository.delete({ user: { id: user.id } });
        } catch (error) {
            // throw new ErrorManager({
            //     type: 'CONFLICT',
            //     message: 'Unable to delete SQL info',
            // });
        }

        return await this.userRepository.delete({ mail });
    }

    /**
     * Método para devolver a todos los usuarios en la base de datos que han sido confirmados,
     * por defecto devuelve los valores "mail" y "role", si se quieren devolver más valores, se debe
     * modificar tanto la query de búsqueda como la interfaz AllUsersOutput.
     *
     * @returns     Un objeto de interfaz de tipo AllUsersOutput con todos los usuarios
     */
    async findAll(): Promise<AllUsersOutputDto> {
        const users = await this.userRepository.find({
            select: {
                id: true,
                mail: true,
                role: true,
                twoFactorCode : true,
                name: true,
                language: true,
                createdAt: true,
            }
        });

        const completeUsers: UserInfoDTO[] = [];

        for (const user of users) {
            completeUsers.push({
                id: user.id,
                name: user.name ?? '',
                mail: user.mail,
                role: user.role,
                language: user.language,
                twoFactorCode: user.twoFactorCode,
                createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date(0).toISOString(),
            });
        }

        return { user: completeUsers };
    }

    /**
     * Método para devolver los usuarios confirmados de la base de datos con paginación.
     * Devuelve una estructura con la lista de usuarios y la paginación.
     *
     * @param page       Número de página solicitada
     * @param pageSize   Tamaño de la página (cantidad de usuarios por página)
     * @returns          Objeto de tipo PaginatedUsersOutputDto con usuarios y datos de paginación
     */
    async findAllPaginated(
        page: number,
        pageSize: number,
        order: OrderDTO<OrderUsers>[],
        mail?: string,
    ): Promise<PaginatedResponse<UserInfoDTO>> {
        if (!page || !pageSize || page < 1 || pageSize < 1) {
            throw new ErrorManager('NOT_ACCEPTABLE', 'PAGESIZE INVALID');
        }
        const where = {
            ...(mail && { mail: ILike(`%${mail}%`) }),
        };

        const [users, total] = await this.userRepository.findAndCount({
            where,
            select: {
                id: true,
                name: true,
                mail: true,
                role: true,
                language: true,
                twoFactorCode: true,
                createdAt: true,
            },
            order: orderIntoFindOptions(order),
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const formattedUsers: UserInfoDTO[] = await Promise.all(
            users.map(async (user) => {
                const userRet: UserInfoDTO = {
                    id: user.id,
                    name: user.name ?? '',
                    mail: user.mail,
                    role: user.role,
                    language: user.language,
                    twoFactorCode: user.twoFactorCode,
                    createdAt: new Date(user.createdAt).toLocaleString(),
                };
                return userRet;
            }),
        );

        return {
            list: formattedUsers,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    /**
     * Devuelve todos los datos de un usuario empleando solo su correo pero omite su contraseña,
     * este método, a diferencia de findAllData, oculta el valor de la contraseña. Se recomienda
     * usar este método en lugar de findAllData para mas seguridad a la hora de devolver datos al
     * front o comunicar con otros procesos.
     *
     * @param mail  El correo del usuario que se quiere obtener
     * @returns     Un objeto de tipo User con todos los datos del usuario menos la contraseña
     */
    async findByMail(mail: string): Promise<Omit<User, 'password'> | null> {
        return await this.userRepository.findOneBy({ mail: mail });
    }

    /**
     * Devuelve todos los datos de un usuario empleando solo su correo. Este método permite
     * una búsqueda rápida pero también poco segura dado que omite el uso de la contraseña.
     * Se debe tener cuidado donde se emplea y asegurar no conceder acceso a métodos globales
     * o end-points a este método de forma no controlada. Se recomienda usar findByMail() siempre.
     *
     * @param mail  El correo del usuario que se quiere obtener
     * @returns     Un objeto de tipo User con todos los datos del usuario
     */
    async findAllData(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { mail: email },
            select: {
                id: true,
                name: true,
                mail: true,
                password: true,
                role: true,
                twoFactorCode: true,
                language: true,
                theme: true,
                lastLogIn: true,
            }
        });
    }

    /**
     * Método para recuperar la información del usuario empleando una interfaz de tipo
     * UserOutput para controlar la salida. Permite encapsular de forma controlada lo que se
     * quiere mandar al front. Está pensado para usar en conjunto con UserActiveInterface y
     * así gestionar un mejor intercambio de datos.
     *
     * @param mail  Correo del usuario del cual queremos obtener los datos
     * @returns     Una interfaz de tipo UserOutput con los datos filtrados
     */
    async profile(mail: string): Promise<UserOutput> {
        const user = await this.findAllData(mail);
        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        const userOut: UserOutput = {
            mail: user.mail,
            role: user.role,
        };

        return userOut;
    }

    /**
     * Método que cambia el estado del 2FA de un usuario. Recupera la información del usuario,
     * obtiene el valor actual del 2FA y lo cambia a su valor contrario. Pensado para
     * SUPER_ADMIN y gestión de usuarios.
     *
     * @param id        ID en base de datos del usuario al que activar o desactivar el 2FA
     * @returns         Nueva información del usuario
     */
    async updateOther2FA(id: number) {
        const user = await this.userRepository.findOne({ where: { id: id } });
        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }
        user.twoFactorCode = !user.twoFactorCode;
        return await this.userRepository.save(user);
    }

    /**
     * Método que comprueba si un usuario tiene OTP esperando validación (con fecha valida) y
     * valida dicho registro.
     *
     * @param mail      Correo del usuario al que validar sus OTP
     * @param otp       OTP (one time password) para comprobar validez
     * @returns         True si ha sido posible validar el OTP, diferentes errores en caso
     *                  de no ser posible
     */
    async validateOtp(mail: string, otp: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { mail: mail },
            relations: { otps: true },
        });

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        const otpEntity = user.otps.find((otpEntity) => otpEntity.otp === otp);

        if (!otpEntity) {
            throw new ErrorManager('UNAUTHORIZED', 'INVALID OTP');
        }

        if (otpEntity.validated) {
            throw new ErrorManager('UNAUTHORIZED', 'OTP ALREADY VALIDATED');
        }

        if (new Date() > otpEntity.expiration) {
            throw new ErrorManager('UNAUTHORIZED', 'OTP EXPIRED');
        }

        otpEntity.validated = true;
        await this.otpRepository.save(otpEntity);
        return true;
    }

    /**
     * Método para guardar un OTP en la base de datos. Se comprueba si ya existen OTP para
     * el usuario, borra los que ya existen y almacena el nuevo. Solo es posible tener un
     * OTP esperando validación para el usuario. Gestiona, entre otras cosas, el tiempo
     * de expiración del OTP.
     *
     * @param mail      Correo del usuario al que relacionar el OTP
     * @param otp       OTP (one time password) que almacenar
     */
    async storeOtp(mail: string, otp: string): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { mail: mail },
        });

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        // Se comprueba si ya existen OTP para el usuario
        const existingOtp = await this.otpRepository.findOne({
            where: { user: { id: user.id } },
        });

        // Si existen, se borran
        if (existingOtp) await this.otpRepository.remove(existingOtp);

        // Generar fecha de expiración. Valor de expiración en .env
        const expiration = new Date();
        const expirationMinutes = this.getEnvNumber('TWO_FA_EXPIRATION');
        expiration.setMinutes(expiration.getMinutes() + expirationMinutes);

        const otpEntity = this.otpRepository.create({
            user,
            otp,
            expiration,
            validated: false,
        });

        // Guardar nuevo OTP
        await this.otpRepository.save(otpEntity);
    }

    /**
     * Método para actualizar la información del usuario. Permite actualizar todo menos la
     * contraseña que se debe actualizar con updatePassword(userMail,updatePasswordDto). En
     * caso de añadir nuevos datos al usuario, se debe actualizar aquí también.
     *
     * @param original          Objeto de tipo UserActiveInterface con los datos del usuario a actualizar
     * @param updateUserDto     Objeto con los nuevos datos del usuario, todos los campos deben ser optativos
     * @returns                 Valores obtenidos del ORM con los nuevos datos del usuario
     */
    async updateUser(original: UserActiveInterface, updateUserDto: UpdateUserDto): Promise<LoginInterface> {
        try {
            const { mail, name, role, twoFactorCode, language } = updateUserDto;
            const user = await this.userRepository.findOne({
                where: { mail: original.mail },
            });

            if (!user) {
                throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
            }

            // Comprobar de que si se cambia el mail, no exista un usuario con dicho mail
            if (updateUserDto.mail && updateUserDto.mail !== user.mail) {
                const existingUserNewMail = await this.userRepository.findOne({
                    where: { mail: updateUserDto.mail },
                });
                if (existingUserNewMail) {
                    throw new ErrorManager('CONFLICT', 'MAIL DUPLICATED');
                }
            }

            /**
             * En caso de añadir nuevos datos al usuario en la base de datos es importante
             * reflejar aquí los valores para la posible actualización. Es importante tener
             * mucho cuidado con los datos de tipo boolean, como el twoFactorCode, dado que
             * la expresión de comprobación debe ser diferente.
             */
            if (typeof mail === 'string') user.mail = mail;
            if (typeof name === 'string') user.name = name;
            if (role !== undefined) user.role = role;
            if (twoFactorCode !== undefined) user.twoFactorCode = twoFactorCode;
            if (language !== undefined) user.language = language;

            const updatedUser = await this.userRepository.save(user);

            // Crea un nuevo token JWT con los nuevos datos del usuario
            const totalCompanies = await this.companyService.totalCompanies(updatedUser.id);
            const payloadUser = {
                // Valores temporales para LoginInterface
                id: updatedUser.id,
                mail: updatedUser.mail,
                role: updatedUser.role,
                name: updatedUser.name ?? '',
                validated: true, // El usuario debe de estar validado para acceder al endpoint
                language: updatedUser.language,
            } as UserActiveInterface;

            const backEndTokens = await this.authService.createBackendTokens(payloadUser);
            const userRet: LoginInterface = {
                user: { ...payloadUser,twoFactorCode: updatedUser.twoFactorCode, companies: totalCompanies, lastLogIn: updatedUser.lastLogIn, theme: updatedUser.theme },
                backend_tokens: backEndTokens,
            };
            return userRet;
        } catch (error) {
            this.rethrowUnknownError(error, 'Error updating user');
        }
    }

    /**
     * Metodo para SUPER_ADMIN para actualizar la información de un usuario. Permite actualizar
     * todo menos la contraseña que se debe actualizar con updatePassword(userMail,updatePasswordDto).
     * En caso de añadir nuevos datos al usuario, se debe actualizar aquí también.
     *
     * @param id                    ID en base de datos del usuario a actualizar
     * @param updateUserDto         Objeto con nuevos datos
     * @returns                     Mensaje de confirmación
     */
    async updateUserByAdmin(id: number, updateUserDto: UpdateUserDto, activeUser: UserActiveInterface): Promise<User> {
        try {
            if (id === activeUser.id) {
                throw new ErrorManager('CONFLICT', 'CANNOT UPDATE USER');
            }

            const { mail, name, role, twoFactorCode, language } = updateUserDto;

            const user = await this.userRepository.findOne({
                where: { id },
            });

            if (!user) {
                throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
            }

            // Comprobar si el nuevo mail ya está en uso por otro usuario (distinto del actual)
            if (updateUserDto.mail && updateUserDto.mail !== user.mail) {
                const existingUserNewMail = await this.userRepository.findOne({
                    where: { mail: updateUserDto.mail },
                });

                if (existingUserNewMail) {
                    throw new ErrorManager('CONFLICT', 'MAIL DUPLICATED');
                }
            }

            if (typeof mail === 'string') user.mail = mail;
            if (typeof name === 'string') user.name = name;
            if (role !== undefined) user.role = role;
            if (twoFactorCode !== undefined) user.twoFactorCode = twoFactorCode;
            if (language !== undefined) user.language = language;

            return await this.userRepository.save(user);
        } catch (error) {
            this.rethrowUnknownError(error, 'Error updating user');
        }
    }

    private rethrowUnknownError(error: unknown, fallbackMessage: string): never {
        if (error instanceof ErrorManager) {
            throw error;
        }

        const message = error instanceof Error && error.message ? error.message : fallbackMessage;
        throw new ErrorManager('INTERNAL_SERVER_ERROR', message);
    }

    private getEnvNumber(key: keyof NodeJS.ProcessEnv): number {
        const rawValue = process.env[key];
        if (!rawValue) {
            throw new ErrorManager('INTERNAL_SERVER_ERROR', `${key} environment variable is not set`);
        }

        const parsed = Number.parseInt(rawValue, 10);
        if (Number.isNaN(parsed)) {
            throw new ErrorManager('INTERNAL_SERVER_ERROR', `${key} environment variable is invalid`);
        }

        return parsed;
    }

    /**
     * Actualiza la contraseña de un usuario. Las comprobaciones de seguridad son dadas
     * por el end-point. Este método solo toma de entrada el correo electrónico del usuario
     * y la nueva contraseña. No comprueba permisos, solo compara contraseña mediante el uso de
     * los datos dentro de updatePasswordDto.
     *
     * @param userMail              Correo del usuario al que actualizar
     * @param updatePasswordDto     Nuevos datos de la contraseña (importante el DTO para validación)
     * @returns                     Nuevos datos obtenidos del ORM para el usuario o diferentes tipos
     *                              de errores
     */
    async updatePassword(userMail: string, updatePasswordDto: UpdatePasswordDto) {
        const { oldPassword, newPassword } = updatePasswordDto;

        // El findOne devuelve también la contraseña antigua
        const user = await this.userRepository.findOne({
            where: { mail: userMail },
            select: { id: true, name: true },
        });

        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        if (!user.password) {
            throw new ErrorManager('INTERNAL_SERVER_ERROR', 'USER NOT FOUND');
        }

        // Comprueba si la contraseña antigua proporcionada es correcta
        const isPasswordValid = oldPassword === user.password || (await bcryptjs.compare(oldPassword, user.password));
        if (!isPasswordValid) {
            throw new ErrorManager(`BAD_REQUEST`, 'INVALID OLD PASSWORD');
        }

        // Actualizar datos
        user.password = await bcryptjs.hash(newPassword, APPConstants.PASSWORDS_SALT_ROUNDS);
        return await this.userRepository.save(user);
    }
    /**
     * Método para actualizar el modo oscuro del usuario activo
     */
    async changeTheme(activeUser: UserActiveInterface, theme: string | null): Promise<string> {
        // Validar que el tema sea válido
        if (theme !== null && theme !== 'light' && theme !== 'dark') {
            throw new ErrorManager('BAD_REQUEST', 'INVALID THEME');
        }

        const user = await this.userRepository.findOneBy({ id: activeUser.id });
        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        user.theme = theme;
        await this.userRepository.save(user);
        return user.theme ?? 'light';
    }
}
