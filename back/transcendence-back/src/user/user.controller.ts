import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { AllUsersOutputDto, UserInfoDTO } from './dto-outputs/all-users.output.dto';
import { AvatarOutputDTO } from './dto-outputs/avatar.output.dto';
import { UserOutputDto } from './dto-outputs/user.output.dto';
import { MailDto } from './dto/mail.dto';
import { UpdatePasswordDto } from './dto/update-pass.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { PaginatedResponse } from 'src/common/dtos/paginated.dto';
import { OrderUsers } from './enums/order-user.enum';
//import { ReturnMessage } from 'src/common/decorators/wrap-endpoint.decorator';
import { EnableLogging } from 'src/common/decorators/loggin.decorator';
import { OrderPipe } from 'src/common/pipes/order.pipe';
import { OrderDTO } from 'src/common/dtos/order.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('users - Consulta de información y borrado de usuarios')
@Controller('user')
export class UserController {
    /**
     * El constructor del controller solo necesita el servicio de usuarios para lanzar los
     * métodos de consulta y CRUD
     *
     * @param usersService
     */
    constructor(private readonly usersService: UserService) {}

    /**
     * Método para listar usuarios paginados desde la base de datos.
     * Devuelve una estructura con los usuarios, página actual, tamaño y total de elementos.
     *
     * @param page       Página solicitada (por defecto 1)
     * @param pageSize   Tamaño de página (por defecto 10)
     * @returns          Estructura paginada con los usuarios
     */
    @Auth(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'SUPER_ADMIN: Devuelve todos los usuarios paginados' })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: AllUsersOutputDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid query parameters' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiQuery({
        name: 'mail',
        description: 'Correo del usuario a buscar',
        required: false,
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
        name: 'sort',
        required: false,
        description: 'Orden, formato: campo:direccion. Ej: createdAt:desc',
        isArray: true,
        type: String,
        example: ['mail:desc'],
    })
    @Get('all-users-pagination')
    //@ReturnMessage('valid.USER.GOT_ALL_USERS')
    async getPaginatedUsers(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
        @Query('sort', new OrderPipe(OrderUsers)) order: OrderDTO<OrderUsers>[],
        @Query('mail') mail?: string,
    ): Promise<PaginatedResponse<UserInfoDTO>> {
        return await this.usersService.findAllPaginated(page, pageSize, order, mail);
    }

    /**
     * Método para devolver la información del usuario activo, esto permite recuperar información
     * usando el UserActiveInterface, sin necesidad de parámetros de entrada. Este método debe llevar
     * Auth() y roles para funcionar.
     *
     * @param user  Objeto de tipo UserActiveInterface con la información del usuario
     * @param res   Objeto para encapsular la información de salida
     * @returns     Un objeto interface del tipo UserOutput
     */
    @Get('profile-info')
    @Auth(Role.USER, Role.ADMIN)
    @ApiOperation({
        summary: 'Obtiene la información del perfil del usuario que tiene la sesión iniciada',
    })
    @ApiResponse({
        status: 200,
        description: 'Request successful',
        type: UserOutputDto,
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.USER.GOT_PROFILE')
    async profile(@ActiveUser() user: UserActiveInterface) {
        return await this.usersService.profile(user.mail);
    }

    /**
     * Método para SUPER_ADMIN que permite cambiar el valor de 2FA de otro usuario
     *
     * @param id        ID en base de datos del usuario al que cambiar el valor del 2FA
     * @returns         Mensaje de confirmación en caso de poder cambiarlo, diferentes errores si no
     */
    @Put('update-2FA/:id')
    @Auth(Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'SUPER_ADMIN: Cambia el valor de 2FA de otro usuario',
    })
    @ApiResponse({ status: 200, description: '2FA updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    // @TODO añadir con ApiParam los ejemplos por defecto del seeder
    //@ReturnMessage('valid.USER.CHANGED_2FA_USER')
    async updateTwoFA(@Param('id') id: number) {
        await this.usersService.updateOther2FA(id);
        return { message: '2FA updated successfully' };
    }

    /**
     * Método para actualizar la información del usuario con la sesión iniciada, permite
     * actualizar todo menos la contraseña
     *
     * @param user                  Objeto de tipo UserActiveInterface para obtener la información del usuario
     * @param updateUserDto         Objeto con nuevos datos
     * @returns                     Objeto con información actualizada o diferentes tipos de errores
     */
    @Put('update-user')
    @Auth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Actualiza parcialmente al usuario con la sesión iniciada.',
    })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 403, description: 'Permission denied' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.USER.UPDATED_SELF')
    async updateUser(@ActiveUser() user: UserActiveInterface, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.updateUser(user, updateUserDto);
    }

    /**
     * Método para que el SUPER_ADMIN pueda actualizar cualquier usuario de la base de datos
     * mediante su ID. Permite actualizar cualquier campo del usuario.
     *
     * @param id                    ID en base de datos del usuario a actualizar
     * @param updateUserDto         Objeto con nuevos datos
     * @param ActiveUser            Usuario que lanza la petición
     * @returns                     Mensaje de confirmación
     */
    @Put('update-user-admin/:id')
    @Auth(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'SUPER_ADMIN: Actualiza cualquier usuario por su ID' })
    @ApiParam({
        name: 'id',
        required: true,
        example: 1,
        description: 'ID del usuario a actualizar',
        schema: { type: 'integer', minimum: 1 },
    })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 403, description: 'Permission denied' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.USER.UPDATE_USER')
    async updateAnyUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @ActiveUser() activeUser: UserActiveInterface,
    ) {
        return await this.usersService.updateUserByAdmin(id, updateUserDto, activeUser);
    }

    /**
     * Método para actualizar la contraseña del usuario con la sesión iniciada
     *
     * @param user                  Objeto de tipo UserActiveInterface para obtener la información del usuario
     * @param updatePasswordDto     Objeto con nuevos datos
     * @returns                     Objeto con información actualizada o diferentes tipos de errores
     */
    @Put('update-password')
    @Auth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Actualiza la contraseña del usuario',
    })
    @ApiResponse({ status: 200, description: 'Password updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid old password' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.USER.UPDATED_OWN_PASSWORD')
    async updatePassword(@ActiveUser() user: UserActiveInterface, @Body() updatePasswordDto: UpdatePasswordDto) {
        await this.usersService.updatePassword(user.mail, updatePasswordDto);
        return { message: 'Password updated successfully' };
    }

    /**
     * Método para borrar usuarios. Solo para SUPER_ADMIN. Mediante un email, borra todos los
     * registros en la base de datos del usuario.
     *
     * @param mail  Interfaz de tipo MailDto con la información del usuario
     * @param res   Objeto para encapsular la información de salida
     * @returns     Código 200 y mensaje de confirmación o mensajes de error
     */
    @Delete('delete-user')
    @Auth(Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'SUPER_ADMIN: Borra un usuario de la base de datos',
    })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 403, description: 'Permission denied' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.USER.DELETED')
    async deleteUser(@Body() mail: MailDto) {
        await this.usersService.deleteUser(mail.mail);
        return { message: 'User deleted successfully' };
    }

    /**
     * Método para borrar al usuario que lanza el método. Esté método no es igual que deleteUser(),
     * este método controla que el borrado se ejecute sobre el usuario que lo lanza, deleteUser() te
     * pide un correo.
     *
     * @param user  Objeto UserActiveInterface con la información del usuario
     * @param res   Objeto para encapsular la información de salida
     * @returns     Código 200 y mensaje de confirmación o mensajes de error
     */
    @Delete('desactivate-user')
    @Auth(Role.USER, Role.ADMIN)
    @ApiOperation({
        summary: 'Desactiva la cuenta del usuario que lanza el end-point. CUIDADO: No pide confirmación',
    })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 403, description: 'Permission denied' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.USER.DEACTIVATED_USER')
    async desactivateUser(@ActiveUser() user: UserActiveInterface) {
        await this.usersService.deleteUser(user.mail);
        return { message: 'User deleted successfully' };
    }

    /**
     * Método para cambiar el tema del usuario activo
     *
     * @param user  Objeto UserActiveInterface con la información del usuario
     * @param theme Nuevo tema a establecer
     * @returns     Código 200 y mensaje de confirmación o mensajes de error
     */
   @Patch('change-theme')
    @Auth(Role.USER, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Cambia el tema de visualización del usuario con sesión iniciada',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                theme: {
                    type: 'string',
                    enum: ['light', 'dark'],
                    nullable: true,
                    example: 'dark',
                    description: '"light" para tema oscuro, "dark" para tema claro',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Theme changed successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.USER.CHANGED_THEME')
    async changeTheme(@ActiveUser() userActive: UserActiveInterface, @Body() { theme }: { theme: string | null }) {
        return await this.usersService.changeTheme(userActive, theme);
    }
}
