import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import MailController from './mail.controller';
import MailService from './mail.service';
import { NodemailerModule } from './node-transporter.module';
import { MailProcessor } from './processor/mail.processor';

@Module({
    imports: [forwardRef(() => AuthModule), UserModule, NodemailerModule],
    providers: [MailService, MailProcessor],
    controllers: [MailController],
    exports: [MailService],
})
export default class MailModule {}
