import { Module } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Module({
    providers: [
        {
            provide: 'MAILER_TRANSPORTER',
            useFactory: async () => {
                const transporter = nodemailer.createTransport({
                    service: process.env.EMAIL_HOST,
                    auth: {
                        user: process.env.EMAIL_USERNAME,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                });
                return transporter;
            },
        },
    ],
    exports: ['MAILER_TRANSPORTER'],
})
export class NodemailerModule {}
