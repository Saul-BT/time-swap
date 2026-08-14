import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import MailService from '../mail.service';
import { ErrorManager } from 'src/common/error-handling/error.manager';
//import { I18nService } from 'nestjs-i18n';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Processor('mail-queue')
@Injectable()
export class MailProcessor {
    private readonly logger = new Logger(MailProcessor.name);

    constructor(
        //private readonly i18n: I18nService<I18nTranslations>,
        private readonly mailService: MailService,
    ) {}

    @Process('send-reset-password')
    async handleSendResetPassword(job: Job<{ mail: string; url: string }>) {
        try {
            await this.mailService.sendResetPassword(job.data.mail, job.data.url);
            this.logger.debug(`Correo enviado a ${job.data.mail}`);
        } catch (error) {
            this.logger.error('Error al enviar correo', error);
            throw new ErrorManager('INTERNAL_SERVER_ERROR', 'MAIL SEND ERROR');
        }
    }

    @Process('send-verification-2fa')
    async handleSendVerification2fa(job: Job<{ mail: string }>) {
        try {
            await this.mailService.sendVerification(job.data.mail);
            this.logger.debug(`Correo enviado a ${job.data.mail}`);
        } catch (error) {
            this.logger.error('Error al enviar correo', error);
            throw new ErrorManager('INTERNAL_SERVER_ERROR', 'MAIL SEND ERROR');
        }
    }
}
