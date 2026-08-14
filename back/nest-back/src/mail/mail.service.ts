import { Inject, Injectable } from '@nestjs/common';
import otpGenerator from 'otp-generator';
import { ErrorManager } from '../common/error-handling/error.manager';
import { UserService } from '../user/user.service';
import { Transporter } from 'nodemailer';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as handlebars from 'handlebars';
//import { I18nService } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export default class MailService {
    /**
     * El servicio importante es el de usuarios, para la gestión de información personalizada, como
     * el nombre. El transporter es el paquete encargado de mandar los correos.
     *
     * @param mailerService     Servicio de correo (por defecto mailer)
     * @param userService       Servicio de usuarios
     */
    constructor(
        //private readonly i18n: I18nService<I18nTranslations>,
        private readonly userService: UserService,
        @Inject('MAILER_TRANSPORTER') private readonly transporter: Transporter,
    ) {}

    /**
     * Compila una plantilla Handlebars ubicada en la carpeta templates/mail.
     * @param templateName Nombre de la plantilla (sin extensión)
     * @param context Datos para la plantilla
     * @returns HTML compilado
     */
    private async compileTemplate(templateName: string, context: any): Promise<string> {
        try {
            const templatePath = join(process.cwd(), 'src', 'templates', 'mail', `${templateName}.hbs`);
            const templateSource = await readFile(templatePath, 'utf-8');
            const compiledTemplate = handlebars.compile(templateSource);
            return compiledTemplate(context);
        } catch (error: unknown) {
            const message = 'MAIL COMPILE ERROR';
            ErrorManager.normalize(error, message);
        }
    }
    /**
     * Método para mandar un correo electrónico con información de reinicio de contraseña.
     *
     * @param mail      El correo electrónico del usuario al que mandar la información
     * @param url       url con token concatenado donde viene la información del reinicio
     * @returns         True si puede mandar el correo. Diferentes errores en caso contrario
     */
    async sendResetPassword(mail: string, url: string): Promise<boolean> {
        try {
            const user = await this.userService.findByMail(mail);
            if (!user) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

            const html = await this.compileTemplate('resetmail', {
                name: user.name,
                url: url,
                APP_NAME: process.env.APP_NAME,
                COMPANY_NAME: process.env.COMPANY_DOMAIN,
            });

            await this.transporter.sendMail({
                from: `"${process.env.COMPANY_DOMAIN}" <${process.env.EMAIL_USERNAME}>`,
                to: mail,
                subject: process.env.APP_NAME + ' - Reinicio de contraseña',
                html,
            });
            return true;
        } catch (error: unknown) {
            ErrorManager.normalize(error, 'Error inesperado');
        }
    }

    /**
     * Método para mandar un codigo OTP (one time password) en un correo electrónico a un usuario
     * que está iniciando sesión y tiene el 2FA activado.
     *
     * @param mail      El correo electrónico del usuario al que mandar la información
     * @returns         Devolverá el código OTP mandado, en caso de poder mandarlo. Diferentes errores
     *                  en caso de no poder.
     */
    async sendVerification(mail: string): Promise<string> {
        try {
            const code = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });

            const user = await this.userService.findByMail(mail);
            if (!user) throw new ErrorManager('NOT_FOUND', 'USER NOT FOUND');

            const html = await this.compileTemplate('verification', {
                name: user.name,
                code: code,
                APP_NAME: process.env.APP_NAME,
            });

            await this.transporter.sendMail({
                from: `"${process.env.COMPANY_DOMAIN}" <${process.env.EMAIL_USERNAME}>`,
                to: mail,
                subject: process.env.APP_NAME + ' - Tu código de verificación',
                html,
            });

            await this.userService.storeOtp(mail, code);

            return code;
        } catch (error: unknown) {
            ErrorManager.normalize(error, 'Error inesperado');
        }
    }
}
