import {
    Body,
    Controller,
    DefaultValuePipe,
    ParseIntPipe,
    Get,
    Headers,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiHeader,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ThrotterGuardErrorDto } from '../common/dtos/throttler-guard.dto';
import { Role } from '../common/enums/role.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Language } from '../user/enums/language.enum';
import { Auth } from './decorators/auth.decorator';
import { LoginOutputDto } from './dto-outputs/login.output.dto';
import { NewRegisterOutput } from './dto-outputs/new-register.output.dto';
import { RejectOutputDto } from './dto-outputs/reject.output.dto';
import { VerifyOutputDto } from './dto-outputs/verify.output.dto';
import { LoginDto } from './dto/login.dto';
import { NewRegisterDto } from './dto/new-register.dto';
import { OtpDto } from './dto/otp.dto';
import { RejectUserDto } from './dto/reject.dto';
import { ResetPassDTO } from './dto/reset-pass.dto';
import { ResetPrePassDto } from './dto/reset-pre-pass';
import { VerifyDto } from './dto/verify.dto';
import { RefreshGuard } from './guard/refresh.guard';
import { AuthService } from './services/auth.service';
import { ResetService } from './services/reset.service';
//import { ReturnMessage } from 'src/common/decorators/wrap-endpoint.decorator';
import { PaginatedResponse } from 'src/common/dtos/paginated.dto';
//import { I18nService } from 'nestjs-i18n';
import { ErrorManager } from 'src/common/error-handling/error.manager';
import { OrderVerification } from './enums/order-verification.enum';
import { UnverifiedOutDTO } from './dto-outputs/unverified.output.dto';
import { OrderPipe } from 'src/common/pipes/order.pipe';
import { OrderDTO } from 'src/common/dtos/order.dto';
//import { I18nTranslations } from 'src/i18n/generated/i18n.generated';
import { Request as ExpressRequest } from 'express';
import { LanguageDto } from './dto/language.dto';

@ApiTags('auth - Autenticación de usuarios')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    /**
     * El constructor del controlador solo tiene dentro el servicio del modulo, no tiene dependencias externas.
     *
     * @param authService   Servicio del mismo módulo que el controlador
     */
    constructor(
        private authService: AuthService,
        private resetService: ResetService,
        //private readonly i18n: I18nService<I18nTranslations>,
    ) {}

    /**
     * El método login se usa para comprobar, mediante un email y una contraseña si un usuario ya está registrado
     * en la plataforma e inicia sesión. Si el inicio de sesión es correcto, devolverá un objeto JSON con diferente
     * información para el front-end. Entre los datos devueltos, podemos recuperar la información del usuario, email,
     * nombre y rol. Lo más importante que se devuelve es el access_token y el refres_token. Ambos tokens deben
     * usarse para mentener iniciada la sesión del usuario, tanto en swagger para testing como en front-end. El
     * middleware debe gestionar el token de refresco. Se añade un valor de expiración (expires_in) para saber cuanto
     * dura el token. El valor de duración del token viene estipulado en el archivo de configuración .env.
     *
     * @param loginDto      Objeto estructurado con la información del usuario para el login
     * @param res           Objeto para encapsular la información de salida
     * @returns             En caso de que el login se realice Correctamente, devolverá un código 200 y un objeto de tipo
     *                      LoginOutputDto. En caso de dar fallo, devolverá un código de error (400, 429 o 500) y el
     *                      mensaje correspondiente al código
     */
    @Post('login')
    @UseGuards(ThrottlerGuard)
    @ApiOperation({
        summary: 'Iniciar sesión en la plataforma. Devuelve "accessToken" si el inicio es correcto',
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: LoginOutputDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Incorrect credentials or missing mail/password',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests',
        type: ThrotterGuardErrorDto,
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.AUTH.LOGGED')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto); // Lanzar método del servicio
    }

    /**
     * El método register permite crear una nueva entrada en la base de datos para dejar pendiente una verificación
     * por parte de otro método. Este método toma como entrada un objeto de topo NewResigerDto con toda la información
     * que tendrá el usuario una vez verificado. Comprueba, entre otras cosas, si ya existen invitaciones pendientes
     * para el usuario y evita crear más. Este es el primer paso si se quiere añadir un usuario nuevo.
     *
     * @param registerDto   Objeto estructurado con la información del usuario para el registro
     * @param res           Objeto para encapsular la información de salida
     * @returns             En el caso de realizar Correctamente el registro, devolverá un código 201 y un objeto de tipo
     *                      NewRegisterOutput. En caso de dar fallo, devolverá un código de error(400, 409, 429 o 500) y
     *                      el mensaje correspondiente al código
     */
    @Post('register')
    @UseGuards(ThrottlerGuard)
    @ApiOperation({
        summary: 'Registro de usuario nuevo, debe ser verificado antes de usar la plataforma',
    })
    @ApiResponse({
        status: 201,
        description: 'Register successful',
        type: NewRegisterOutput,
    })
    @ApiResponse({ status: 400, description: 'Incorrect credentials' })
    @ApiResponse({ status: 409, description: 'Mail already in use' })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests',
        type: ThrotterGuardErrorDto,
    })
    @ApiHeader({
        name: 'accept-language',
        description: 'Language preference of the user',
        enum: [
            'en',
            'en-US',
            'en-GB',
            'en-CA',
            'en-AU',
            'en-NZ',
            'en-IE',
            'en-ZA',
            'en-IN',
            'es',
            'es-ES',
            'es-MX',
            'es-AR',
            'es-CO',
            'es-CL',
            'es-PE',
            'es-VE',
            'es-EC',
            'es-GT',
            'es-CR',
            'es-PA',
            'es-DO',
            'es-SV',
            'es-HN',
            'es-NI',
            'es-PR',
            'es-UY',
            'es-PY',
            'es-BO',
            'es-CU',
        ],
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.AUTH.REGISTERED')
    async register(@Body() registerDto: NewRegisterDto, @Headers('accept-language') acceptLanguage: string) {
        return await this.authService.register(registerDto, Language.fromHeader(acceptLanguage));
    }

    /**
     * Este método permite, mediante un objeto de tipo VerifyDto que contiene un email y un token de verificación, activar
     * a un usuario en la plataforma. Hasta que el usuario no ha sido verificado, no podrá iniciar sesión en la plataforma.
     * Este paso debe hacerse después de registrar al usuario, el método de registrar devuelve el token de verificación
     * (a parte de guardarlo en la base de datos). El registro puede cancelarse con el método rejectUser.
     *
     * @param acceptDto     Objeto estructurado con la información del usuario para la verificación
     * @param res           Objeto para encapsular la información de salida
     * @returns             En el caso de realizar Correctamente la verificación, devolverá un código 201 y un objeto de tipo
     *                      VerifyOutputDto. En caso de dar fallo, devolverá un código de error(409, 401, 402, 429) y el mensaje
     *                      correspondiente al código
     */
    @Post('verify')
    @Auth(Role.SUPER_ADMIN)
    @UseGuards(ThrottlerGuard)
    @ApiOperation({
        summary: 'SUPER_ADMIN: Usando mail y verificationToken, verifica un usuario para poder usar la plataforma.',
    })
    @ApiResponse({
        status: 201,
        description: 'Verification successful',
        type: VerifyOutputDto,
    })
    @ApiResponse({ status: 409, description: 'Invitation not found' })
    @ApiResponse({ status: 401, description: 'Invalid token' })
    @ApiResponse({
        status: 402,
        description: 'Invitation already accepted or user already exists',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests',
        type: ThrotterGuardErrorDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    //@ReturnMessage('valid.AUTH.VERIFIED')
    async verifyRegistration(@Body() acceptDto: VerifyDto) {
        return await this.authService.verify(acceptDto); // Lanzar método del servicio
    }

    /**
     * Método para rechazar verificaciones y evitar crear un usuario nuevo en la plataforma. Con este método se borran
     * todas las invitaciones pendientes en la base de datos referente a un email dado con el objeto RejectUserDto de
     * los parámetros de entrada.
     *
     * @param rejectDto     Objeto estructurado con la información del usuario para el rechazo de la verificación
     * @param res           Objeto para encapsular la información de salida
     * @returns             En caso de realizar Correctamente el rechazo, devolverá un código 200 y un objeto del tipo
     *                      RejectOutputDto. En caso de dar fallo, devolverá un código de error 409 y el mensaje
     *                      correspondiente.
     */
    @Post('reject')
    @Auth(Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'SUPER_ADMIN: Rechaza todas las invitaciones pendientes asociadas a un email',
    })
    @ApiResponse({
        status: 200,
        description: 'Reject successful',
        type: RejectOutputDto,
    })
    @ApiResponse({
        status: 409,
        description: 'Impossible to delete the invitation',
    })
    //@ReturnMessage('valid.AUTH.REJECTED')
    async rejectUser(@Body() rejectDto: RejectUserDto) {
        return await this.authService.reject(rejectDto); // Lanzar método del servicio
    }

    /**
     * Método para generar un nuevo toquen de refresco. Usado solo por Middleware.
     *
     * @param req           Objeto con la información encapusalda del usuario
     * @returns             Objeto con nuevos tokens
     */
    @UseGuards(RefreshGuard)
    @Post('refresh')
    @ApiOperation({
        summary: 'MIDDLEWARE: Refresca el token de sesión para el usuario activo.',
    })
    @ApiForbiddenResponse({ description: 'New token' })
    //@ReturnMessage('valid.AUTH.GOT_REFRESHED_TOKEN')
    async refreshToken(@Request() req: ExpressRequest & { user: UserActiveInterface }) {
        return await this.authService.refreshToken(req.user); // Lanzar método del servicio
    }

    /**
     * Método para mostrar todos los registros que aún no han sido ni aprovados ni rechazados.
     *
     * @returns     Objeto con la lista de usuarios y sus tokens de verificación
     */
    @Auth(Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'SUPER_ADMIN: Muestra todos los registros sin aprobar',
    })
    @ApiQuery({
        name: 'page',
        description: 'Número de página',
        required: false,
        example: 1,
    })
    @ApiQuery({
        name: 'pageSize',
        description: 'Cantidad de elementos por página',
        required: false,
        example: 10,
    })
    @ApiQuery({
        name: 'mail',
        description: 'Email del usuario a buscar',
        required: false,
        example: 'correo@gmail.com',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Orden, formato: campo:direccion. Ej: createdAt:desc',
        isArray: true,
        type: String,
        example: ['createdAt:desc'],
    })
    @Get('unverified')
    @ApiResponse({
        status: 200,
        description: 'Request successful',
        type: PaginatedResponse<UnverifiedOutDTO>,
    })
    //@ReturnMessage('valid.AUTH.GOT_ALL_UNVERIFIED')
    async getUnverified(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
        @Query('mail') mail: string,
        @Query('sort', new OrderPipe(OrderVerification)) order: OrderDTO<OrderVerification>[],
    ): Promise<PaginatedResponse<UnverifiedOutDTO>> {
        if (!page || !pageSize || page < 1 || pageSize < 1) {
            throw new ErrorManager('NOT_ACCEPTABLE', await 'PAGESIZE INVALID');
        }
        return await this.authService.getUnverified(page, pageSize, order, mail); // Lanzar método del servicio
    }

    /**
     * Método para mandar un correo de reinicio de contraseña a un usuario. Este método no requiere
     * que el usuario tenga iniciada la sesión.
     *
     * @param resetDto  Objeto estructurado con la información del usuario al que mandar el correo
     * @returns         Confirmación de correo enviado o diferentes errores
     */
    @Post('send-reset-mail')
    @UseGuards(ThrottlerGuard)
    @ApiOperation({
        summary: 'EXTERNO - Manda un enlace de restablecimiento de contraseña al mail indicado',
    })
    @ApiResponse({
        status: 200,
        description: 'Email send successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Email not found',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    //@ReturnMessage('valid.AUTH.SENT_PASSWORD_RESET_EMAIL')
    async sendResetMail(@Body() resetDto: ResetPrePassDto) {
        await this.resetService.sendResetMail(resetDto.mail);
        return { message: 'Email send successfully' };
    }

    /**
     * Método que permite reiniciar la contraseña de un usuario sin tener la sesión iniciada. Este método
     * recoge un token con información encriptada, dentro de dicho token se encuentra el mail del usuario
     * al que queremos reiniciar la contraseña. También toma de entrada la nueva contraseña.
     *
     * @param encryptedToken        Token con información cifrada para el reinicio
     * @param resetPasswordDto      Objeto con información de la nueva contraseña
     * @returns                     Nueva información del usuario o errores de diferentes tipos
     */
    @Post('reset-password')
    @UseGuards(ThrottlerGuard)
    @ApiOperation({
        summary: 'EXTERNO - Restablece la contraseña del usuario utilizando el token proporcionado',
    })
    @ApiResponse({
        status: 200,
        description: 'Password reset successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid token or user',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    //@ReturnMessage('valid.AUTH.RESETED_PASSWORD')
    async resetPassword(@Query('token') encryptedToken: string, @Body() resetPasswordDto: ResetPassDTO) {
        await this.resetService.resetPassword(encryptedToken, resetPasswordDto.password);
        return { message: 'Password reset successfully' };
    }

    /**
     * Método para verificar un OTP (one time password) de un usuario que ha iniciado sesión pero
     * tiene el 2FA activado. Este usuario solo debe poder acceder a este end-point hasta conseguir
     * la verificación.
     *
     * @param otpDto    Información del OTP
     * @param user      Objetio de tipo UserActiveInterface con información del usuario que inicia sesión
     * @returns         Nueva información con tokens JWT de acceso ya autorizados
     */
    @Post('verify-otp')
    @UseGuards(ThrottlerGuard)
    @ApiOperation({
        summary: 'Un usuario ya verificado comprueba su código de OTP mandado por el 2FA',
    })
    @Auth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
    @ApiResponse({
        status: 200,
        description: 'OTP validated successfully',
        type: LoginOutputDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid OTP or user not found',
    })
    @ApiResponse({
        status: 429,
        description: 'Too Many Requests',
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.AUTH.VERIFIED_OTP')
    async verifyOtp(@Body() otpDto: OtpDto, @ActiveUser() user: UserActiveInterface) {
        return await this.authService.validateOtp(user.mail, otpDto.code);
    }

    /**
     * Método para cambiar el lenguaje de un usuario activo.
     *
     * @param language      Nuevo lenguaje del usuario
     * @param user          Objeto con la información del usuario activo
     * @returns             Confirmación de cambio de lenguaje o error
     */
    @Post('change-language')
    @ApiOperation({
        summary: 'Usuario activo cambia su lenguaje preferido',
    })
    //@Auth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
    @ApiResponse({
        status: 200,
        description: 'Language changed successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid language or user not found',
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.AUTH.CHANGED_LANGUAGE')
    async changeLanguage(
        @Body() languagedto: LanguageDto,
        @ActiveUser() user: UserActiveInterface,
    ) {
        await this.authService.changeLanguage(user, languagedto.language);
        return { message: 'Language changed successfully' };
    }
}
