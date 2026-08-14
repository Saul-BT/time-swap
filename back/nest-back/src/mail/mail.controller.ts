import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import MailService from './mail.service';
//import { ReturnMessage } from 'src/common/decorators/wrap-endpoint.decorator';

@Controller('mail')
@ApiTags('mail - gestión de correos')
@ApiBearerAuth()
export default class MailController {
    constructor(private readonly mailService: MailService) {}

    /**
     * Método solo para SUPER_ADMIN. Envia un correo electrónico con un OTP, simulando un inicio
     * de sesión del 2FA. Se usa para probar si el servicio de correo está funcionando, no tiene
     * útilidad real.
     *
     * @param user      Objeto de tipo UserActiveInterface para obtener la información
     *                  y poder mandar el correo
     * @returns         Mensaje de correo enviado o error de diferentes tiposF
     */
    @Post('send-email')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Enviar un correo electrónico con un código al usuario con sesión iniciada',
    })
    @ApiResponse({
        status: 200,
        description: 'Correo enviado exitosamente',
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @Auth(Role.SUPER_ADMIN)
    //@ReturnMessage('valid.EMAIL.SENT')
    async sendEmail(@ActiveUser() user: UserActiveInterface) {
        await this.mailService.sendVerification(user.mail);
        return { message: 'Email send' };
    }
}
