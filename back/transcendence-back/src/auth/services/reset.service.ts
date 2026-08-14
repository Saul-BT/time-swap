import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorManager } from '../../common/error-handling/error.manager';
import { UpdatePasswordDto } from '../../user/dto/update-pass.dto';
import { UserService } from '../../user/user.service';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
//import { I18nService } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { EncryptFunctions } from 'src/common/functions/encrypt-functions';

@Injectable()
export class ResetService {
    /**
     * Constructor del servicio, se inician los servicios USER y JWT para CRUD y el mail para
     * la gestión de correos.
     *
     * @param userService           Servicio para el CRUD de usuario
     * @param jwtService            Servicio JWT para los tokens de acceso
     * @param mailService           Servicio para gestión de correos electrónicos
     */
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectQueue('mail-queue')
        private readonly mailQueue: Queue,
        //private readonly i18n: I18nService<I18nTranslations>,
    ) {}

    /**
     * Método para validar la clave de cifrado establecida en el .env, esta clave debe
     * ser única para cada proyecto y se comprueba en cada llamada al servicio si ha
     * sido alterada o permanece correcta.
     *
     * @returns     Diferentes tipos de errores o un buffer con la información correcta de la clave
     */
    private validateEncryptionKey() {
        const key = process.env.RESET_KEY;

        if (!key) {
            throw new ErrorManager('I_AM_A_TEAPOT', 'RESET KEY NOT DEFINED');
        }

        // Verifica que la clave tenga 32 bytes (64 caracteres hexadecimales)
        if (key.length !== 64) {
            throw new ErrorManager('FAILED_DEPENDENCY', 'RESET KEY INVALID LENGTH');
        }

        return key;
    }

    /**
     * Este método recupera la información de un usuario, luego crea un token donde encapsula la información
     * del usuario y le asocia un tiempo de expiracion. Codifica la información y la manda por correo
     * electrónico. En caso de querer añadir más factores de seguridad, se deben añadir aquí.
     *
     * @param mail      La dirección del usuario sobre la cual generar el enlace de reinicio
     * @returns         True si puede mandar el correo, diferentes errores en caso de que no
     */
    async sendResetMail(mail: string) {
        const user = await this.userService.findByMail(mail);
        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        const token = this.jwtService.sign({ mail }, { expiresIn: '1h' });

        // Encriptar token
        const key = this.validateEncryptionKey();
        const encryptedToken = EncryptFunctions.encryptBuffer(token, key);
        const encodedURIToken = encodeURIComponent(encryptedToken.toString('base64')); // Convertimos a base64 y lo enviamos encodeado como URIComponent

        const resetLink = `${process.env.URL_DOMAIN}/reset-password?token=${encodedURIToken}`;

        /**
         * Una vez creado el token (resetLink), se mandará desde aquí. En caso de querer añadir
         * más factores de seguridad, se deben mandar todos desde esta sección de código.
         */
        await this.mailQueue.add('send-reset-password', {
            mail: user.mail,
            url: resetLink,
        });
    }

    /**
     * Este método comprueba que un token encriptado es correcto y, en caso de serlo, asocia
     * una nueva contraseña al usuario que obtiene del token.
     *
     * @param encryptedToken    Token generado mediante el método sendResetMail(mail)
     * @param newPassword       Nueva contraseña para el usuario
     * @returns                 Información del usuario actualizadao
     */
    async resetPassword(encryptedToken: string, newPassword: string) {
        // Decode el token como URI y convertirlo a un buffer de bytes desde base64
        const encriptedBase64JWT = decodeURIComponent(encryptedToken);
        const encriptedJWT = Buffer.from(encriptedBase64JWT, 'base64');

        // Validar y obtener la clave de cifrado
        const key = this.validateEncryptionKey();

        // Descifrar el token
        let decryptedToken: Buffer;
        try {
            decryptedToken = EncryptFunctions.decryptBuffer(encriptedJWT, key);
        } catch (err) {
            throw new ErrorManager('CONFLICT', 'INVALID JWT');
        }

        // Verificar el JWT
        const payload = this.jwtService.verify(decryptedToken.toString());

        // Comprobar si el usuario existe
        const user = await this.userService.findAllData(payload.mail);
        if (!user) {
            throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');
        }

        // Modificar la contraseña del usuarioO
        const dto: UpdatePasswordDto = {
            oldPassword: user.password!,
            newPassword: newPassword,
        };

        return await this.userService.updatePassword(user.mail, dto);
    }
}
