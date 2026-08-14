import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcrypt';
import { hash } from 'bcrypt';
import * as process from 'node:process';
import { FindManyOptions, ILike, IsNull, Repository } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { ErrorManager } from '../../common/error-handling/error.manager';
import { CompanyService } from '../../company/company.service';
import { Language } from '../../user/enums/language.enum';
import { UserService } from '../../user/user.service';
import { NewRegisterOutput } from '../dto-outputs/new-register.output.dto';
import { VerifyOutputDto } from '../dto-outputs/verify.output.dto';
import { UnverifiedOutDTO } from '../dto-outputs/unverified.output.dto';
import { LoginDto } from '../dto/login.dto';
import { NewRegisterDto } from '../dto/new-register.dto';
import { RejectUserDto } from '../dto/reject.dto';
import { VerifyDto } from '../dto/verify.dto';
import { Verification } from '../entities/verification.entity';
import { RejectInterface } from '../interfaces/reject.interface';
import { PaginatedResponse } from 'src/common/dtos/paginated.dto';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { LoginInterface } from '../interfaces/login.interface';
//import { I18nService } from 'nestjs-i18n';
import { OrderVerification } from '../enums/order-verification.enum';
import { APPConstants } from 'src/common/constants/app-constants';
import { OrderDTO } from 'src/common/dtos/order.dto';
import { orderIntoFindOptions } from 'src/common/utils';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { UserLoginService } from 'src/user/services/user-login.service';

let EXPIRE_TIME: any;

@Injectable()
export class AuthService {
    /**
     * El constructor declara varios servicios esenciales, siendo los dos más destacables el JWT
     * para la gestión de tokens y el UserService, del módulo user, que permite tener acceso al
     * CRUD de usuarios.
     *
     * @param userService           Servicio para el CRUD de usuario
     * @param jwtService            Servicio JWT para los tokens de acceso
     * @param verifyRepository      Entidad para almacenar las verificaciones
     */
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly userLoginService: UserLoginService,
        @InjectRepository(Verification)
        private readonly verifyRepository: Repository<Verification>,
        private readonly companyService: CompanyService,
        @InjectQueue('mail-queue')
        private readonly mailQueue: Queue,
        //private readonly i18n: I18nService<I18nTranslations>,
    ) {
        EXPIRE_TIME = parseInt((process.env.JWT_EXPIRATION ?? '15m').replace('m', '')) * 60 * 1000; // Transformar valor del token desde el .env
    }
    async validateOtp(mail: string, otp: string): Promise<LoginInterface> {
        try {
            const isValid = await this.userService.validateOtp(mail, otp);

            if (isValid) {
                // Obtén la información del usuario que necesitas para createFrontPayload
                const user = await this.userService.findByMail(mail);
                if (!user) {
                    // Aquí lanzamos la excepción si el usuario no se encontró
                    throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
                }

                const totalCompanies = await this.companyService.totalCompanies(user.id);

                // Crea el payload frontend
                const payload_user: UserActiveInterface = {
                    id: user.id,
                    mail: user.mail,
                    role: user.role,
                    name: user.name!,
                    validated: true,
                    language: user.language,
                };


                const backEndTokens = await this.createBackendTokens(payload_user);
                const userRet: LoginInterface = {
                    user: { ...payload_user,lastLogIn: user.lastLogIn, theme: user.theme || null, twoFactorCode: user.twoFactorCode,companies: totalCompanies },
                    backend_tokens: backEndTokens,
                };
                return userRet;
            } else {
                // Lanza una excepción si el OTP es inválido
                throw new ErrorManager('UNAUTHORIZED', 'INVALID OTP');
            }
        } catch (error: unknown) {
            ErrorManager.normalize(error, 'Error inesperado');
        }
    }

    /**
     * Crea el PAYLOAD que se devolverá a front con los datos encapsulados en diferentes
     * tokens JWT.
     *
     * @param payload_user  La información del usuario que se debe encapsular
     * @returns             Objeto con los tokens generados
     */
    async createBackendTokens(payload_user: UserActiveInterface) {
        return {
            access_token: await this.jwtService.signAsync(payload_user),
            refresh_token: await this.jwtService.signAsync(payload_user, {
                expiresIn: parseInt((process.env.JWT_REFRESH_EXPIRATION ?? '15m').replace('m', '')) * 60,
                secret: process.env.JWT_REFRESH_SECRET,
            }),
            expires_in: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        };
    }

    /**
     * Método para crear un nuevo token de refresco usando el servicio de JWT, el objeto
     * encapsulado que devuelve incluye dos tokens, uno de acceso y otro de refresco
     *
     * @param user      Objeto con los valores encapusaldos del usuario
     * @returns         Un objeto con los valores del nuevo token JWT
     */
    async refreshToken(user: UserActiveInterface): Promise<LoginInterface> {
        // Obtener datos actualizados del usuario
        const userNew = await this.userService.findAllData(user.mail);
        
        if (!userNew) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        const totalCompanies = await this.companyService.totalCompanies(userNew.id);

        const payload_user: UserActiveInterface = {
            id: userNew.id,
            mail: userNew.mail,
            role: userNew.role,
            name: userNew.name!,
            validated: user.validated,
            language: userNew.language,
        };

        const backEndTokens = await this.createBackendTokens(payload_user);

        const userRet: LoginInterface = {
            user: {
                ...payload_user,
                lastLogIn: userNew.lastLogIn,
                theme: userNew.theme || null,
                twoFactorCode: userNew.twoFactorCode,
                companies: totalCompanies,
            },
            backend_tokens: backEndTokens,
        };

        return userRet;
    }

    /**
     * Método para iniciar sesión en la plataforma. Gestiona diferentes tipos de errores y devuelve
     * la información en un objeto interfaz con todos los datos reglados para el front-end
     *
     * @param param0    Objeto de tipo LoginDto con los datos del usuario
     * @returns         Objeto de tipo LoginInterface si se puede iniciar sesión, en caso contrario,
     *                  devuelve UnauthorizedEsception
     */
    async login({ mail: email, password }: LoginDto): Promise<LoginInterface> {
        const user = await this.userService.findAllData(email);

        if (!user)
            throw new ErrorManager(
                // Lanza un error de autorización personalizado, manejado por nuestro Error manager
                'UNAUTHORIZED',
                'INVALID CREDENTIALS'
            );
        if (!(await bcryptjs.compare(password, user.password!)))
            // Contraseña incorrecta

            throw new ErrorManager('UNAUTHORIZED', 'INVALID CREDENTIALS');

        // Si el usuario tiene el 2FA activado, mandar correo con OTP
        if (user.twoFactorCode) {
            await this.mailQueue.add('send-verification-2fa', {
                mail: user.mail,
            });
        }

        const oldDate = await this.userLoginService.updateLoginDate(user.id);
        
        const totalCompanies = await this.companyService.totalCompanies(user.id);

        const payload_user = {
            // Valores temporales para LoginInterface
            id: user.id,
            mail: user.mail,
            role: user.role,
            name: user.name,
            validated: !user.twoFactorCode, // Necesita una validacion de 2FA para entrar
            language: user.language,
        } as UserActiveInterface;

        const backEndTokens = await this.createBackendTokens(payload_user);
        const userRet: LoginInterface = {
            user: { ...payload_user, lastLogIn: oldDate!, theme: user.theme || null, twoFactorCode: user.twoFactorCode,companies: totalCompanies },
            backend_tokens: backEndTokens,
        };

        return userRet;
    }

    /**
     * Método para registrar un usuario nuevo en la plataforma. Esto NO CREA un usuario nuevo, si no
     * que crea una entrada en la tabla verification (entidad Verification) donde se almacenan datos
     * “temporales” que, una vez confirmado el usuario con el método verify() pasarán a ser definitivos.
     * El registro también se puede cancelar usando el método reject(). Comprueba que ya exista un
     * registro o usuario con los datos dados (mail) para no registrarlo de nuevo.
     *
     * @param dto   Dto de tipo NewRegisterDto con los datos para el registro
     * @returns     El resultado del CRUD al crear el registro o errores de tipo ConflictException
     */
    async register(dto: NewRegisterDto, lang: Language) {
        const userVerification = await this.verifyRepository.findOne({
            where: { targetEmail: dto.mail },
        });
        if (userVerification)
            // Comprobar si ya existe registro para este user
            throw new ErrorManager('CONFLICT', 'MAIL DUPLICATED');

        const user = await this.userService.findByMail(dto.mail); // Comprobar si ya existe user para el email
        if (user) throw new ErrorManager('CONFLICT', 'MAIL DUPLICATED');

        const verifyExpiredTime = parseInt((process.env.INVITE_EXPIRATION ?? '60m').replace('m', '')) * 60; // Valores de expiración procedentes del .env
        const verificationToken = await this.jwtService.signAsync(
            // Nuevo token de verificación
            { sub: dto.mail },
            { expiresIn: verifyExpiredTime },
        );

        // @TODO: En etapas avanzadas, se debe mandar un mensaje de MAIL para activar. Configurar SMTP cuando sea necesario.

        const userInfo = await this.verifyRepository.save({
            targetEmail: dto.mail,
            verificationToken,
            name: dto.name,
            password: await hash(dto.password, APPConstants.PASSWORDS_SALT_ROUNDS),
            language: lang,
        });

        const registerOutput: NewRegisterOutput = {
            mail: userInfo.targetEmail,
            name: userInfo.name,
            createdAt: userInfo.createdAt,
            updatedAt: userInfo.updatedAt,
            deletedAt: userInfo.deletedAt,
            acceptedAt: userInfo.acceptedAt,
            verificationToken: userInfo.verificationToken,
            language: userInfo.language,
        };
        return registerOutput;
    }

    /**
     * Método para verificar registros y convertirlos en usuarios reales de la plataforma. Se comprueba
     * que exista el registro y no ha sido ya aceptado (por defecto, no se borran registros a menos que
     * se cancele la verificación). Una vez confirmado, se convierten los datos de la verificación en un
     * usuario de la tabla user, usando el CRUD de UserService.
     *
     * @param dto   DTO de tipo VerifyDto con los datos para verificar al usuario
     * @returns     Un objeto de tipo interfaz VerifyOutputDto con los datos del nuevo usuario, en caso
     *              de dar fallo, devuelve diferentes tipos de Excepciones
     */
    async verify(dto: VerifyDto) {
        const register = await this.verifyRepository.findOne({
            where: {
                senderEmail: IsNull(),
                targetEmail: dto.mail,
                verificationToken: dto.verificationToken,
            },
        });

        if (!register) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        if (register.acceptedAt) {
            throw new ErrorManager('CONFLICT', 'INVITATION ALREADY ACCEPTED');
        }

        try {
            // Verificación del token dentro de un try-catch interno
            const payload = await this.jwtService.verifyAsync(dto.verificationToken);

            if (payload.sub !== dto.mail) {
                throw new ErrorManager('CONFLICT', 'EMAILS NOT MATCHING');
            }
        } catch (error) {
            if (error instanceof ErrorManager) {
                throw error;
            } else {
                throw new ErrorManager('UNAUTHORIZED', 'INVALID TOKEN');
            }
        }

        let targetUser = await this.userService.findByMail(dto.mail);
        if (targetUser) {
            throw new ErrorManager('CONFLICT', 'USER EXISTS');
        }

        targetUser = await this.userService.createUser({
            mail: dto.mail,
            name: register.name,
            password: register.password,
            role: Role.USER,
            language: register.language,
        });

        register.acceptedAt = new Date();
        await this.verifyRepository.save(register);

        const output: VerifyOutputDto = {
            email: targetUser.mail,
            name: targetUser.name!,
            role: targetUser.role,
            createdAt: targetUser.createdAt,
            language: targetUser.language,
        };

        return output;
    }

    /**
     * Método para cancelar verificaciones que aún no han sido aceptadas. Esto borrará completamente
     * de la base de datos todo lo referente a las verificaciones pendientes que tenga un usuario
     * (mail) dado. Si el usuario tenía invitación pero ya ha sido aceptada o si no existe invitación,
     * arrojará un error.
     *
     * @param dto   DTO de tipo RejectUserDto con la información del usuario
     * @returns     Objeto interfaz de tipo RejectInterface con los datos del usuario que se ha borrado,
     *              tiene el valor "status" como boolean para confirmar que se ha podido borrar bien. En
     *              caso de dar fallo, arroja un ConflictException
     */
    async reject(dto: RejectUserDto) {
        const userToDelete = await this.verifyRepository.findOne({
            where: { targetEmail: dto.mail, acceptedAt: IsNull() },
        });

        if (!userToDelete) {
            throw new ErrorManager('NOT_FOUND', 'INVITATION ERROR');
        }

        await this.verifyRepository.delete({
            targetEmail: dto.mail,
            acceptedAt: IsNull(),
        });

        const output: RejectInterface = {
            mail: userToDelete.targetEmail,
            name: userToDelete.name,
            verification_token: userToDelete.verificationToken,
            status: true,
        };

        return output;
    }

    /**
     * Método para obtener todos los usuarios aún no verificados de la plataforma. Este método está
     * pensado para disponer de una forma sencilla de recuperar los email y verificationToken asignados
     * sin necesidad de conectar a la BD.
     *
     * @returns     El email y verificationToken de todos los usuarios aún no aceptados
     */
    async getUnverified(
        page: number,
        pageSize: number,
        order: OrderDTO<OrderVerification>[],
        mail?: string,
    ): Promise<PaginatedResponse<UnverifiedOutDTO>> {
        const where: FindManyOptions<Verification>['where'] = { acceptedAt: IsNull() };
        const query: FindManyOptions<Verification> = {
            where,
            select: {
                targetEmail: true,
                verificationToken: true,
                createdAt: true
            },
            order: orderIntoFindOptions(order),
            skip: (page - 1) * pageSize,
            take: pageSize,
        };

        if (mail) {
            if (!Array.isArray(query.where)) {
                query.where = { ...query.where, targetEmail: ILike(`%${mail}%`) };
            }
        }

        const [unverifiedList, total] = await this.verifyRepository.findAndCount(query);

        const output: UnverifiedOutDTO[] = unverifiedList.map((user) => ({
            mail: user.targetEmail,
            verification_token: user.verificationToken,
            createdAt: user.createdAt,
        }));

        return {
            list: output,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    async changeLanguage(user: UserActiveInterface, newLanguage: Language) {
        const userAll = await this.userService.findById(user.id);
        if (!userAll) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }
        if (userAll.language === newLanguage) {
            throw new ErrorManager('CONFLICT', 'SAME LANGUAGE');
        }
        userAll.language = newLanguage;
        await this.userService.updateUser(user, { language: newLanguage });
        //crear nuevo token con el lenguaje actualizado
        const payload_user: UserActiveInterface = {
            id: userAll.id,
            mail: userAll.mail,
            role: userAll.role,
            name: userAll.name!,
            validated: true,
            language: userAll.language,

        };
        const token = this.jwtService.sign(payload_user);
        return { payload_user, token };
    }
}
