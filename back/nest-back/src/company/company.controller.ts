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
    ApiParamOptions,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { CompanyService } from './company.service';
import { AddUserDTO } from './dto/add-user.dto';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { DelegateCompanyDTO } from './dto/delegate.dto';
import { RemoveUserDTO } from './dto/remove-user.dto';
import { UpdateCompanyDTO } from './dto/update-company.dto';
import { UpdateUserCompanyDTO } from './dto/update-user.dto';
import {
    AddToCompanyConflicts,
    CRUDcompanyLogoConflics,
    DelegateCompanyConflict,
    DeleteCompanyConflicts,
    LeaveCompanyConflict,
    RemoveUserToCompanyConflicts,
    UpdateCompanyConflics,
} from './errors/controller.errors';
import { AddUserCompanyOutputDTO } from './outputs/add-user.output.dto';
import { AllCompanyInfoOutputDTO, CompanyDTO } from './outputs/all-info.output.dto';
import { CreateCompanyOutputDTO } from './outputs/create-company.output.dto';
import { DelegateCompanyOutputDTO } from './outputs/delegate.output.dto';
import { DeleteCompanyOutputDTO } from './outputs/delete-company.output.dto';
import { CompanyInfoOutputDTO } from './outputs/info.output.dto';
import { LastOwnerOutputDTO } from './outputs/last-owner.output.dto';
import { LeaveCompanyOutputDTO } from './outputs/leave.output.dto';
import { RemoveUserCompanyOutputDTO } from './outputs/remove-user.output.dto';
import { UpdateCompanyOutputDTO } from './outputs/update-company.output.dto';
import { UpdateUserCompanyOutputDTO } from './outputs/update-user.output.dto';
import { PaginatedResponse } from 'src/common/dtos/paginated.dto';
//import { ReturnMessage } from 'src/common/decorators/wrap-endpoint.decorator';
import { OrderCompany } from './enums/order-company.enum';
import { OrderPipe } from 'src/common/pipes/order.pipe';
import { OrderDTO } from 'src/common/dtos/order.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('company - Consulta de información sobre las compañias')
@Auth(Role.USER, Role.ADMIN)
@Controller('company')
export class CompanyController {
    /**
     * Clase estática para definir datos de ejemplo de cara a la documentación en swagger
     */
    static readonly COMPANY_IDS: ApiParamOptions = {
        name: 'id',
        description: 'Id de prueba para empresas',
        examples: {
            'Example 1 - Empresa 1': {
                value: '1',
            },
            'Example 2 - Empresa 2': {
                value: '2',
            },
            'Example 3 - Empresa 3': {
                value: '3',
            },
            'Example 4 - Empresa 4': {
                value: '4',
            },
        },
    };

    /**
     * El constructor del controlador solo tiene dentro el servicio del modulo, no tiene dependencias externas.
     *
     * @param companyService Servicio del mismo módulo del controlador
     */
    constructor(private readonly companyService: CompanyService) {}
    /**
     *
     * El método de crear compañía se usa para generar una nueva compañía. Los datos de entrada
     * serán controlados por un DTO. Por norma general, el usuario que ha creado la compañía
     * pasará a ser el dueño (OWNER) de la compañía recién creada.
     *
     * @param user          Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint
     * @param companyDto    Objeto estructurado con la información para la creación de la nueva compañía
     * @returns
     */
    @Post('create-company')
    @ApiOperation({
        summary: 'Crea una compañía nueva, el usuario que la crea sera el OWNER.',
    })
    @ApiResponse({
        status: 200,
        description: 'Company successfully created',
        type: CreateCompanyOutputDTO,
    })
    /**
     * En caso de añadir más párametros de seguridad para la creación, se deben documentar
     * los errores que pueda dar el endpoint
     */
    @ApiResponse({
        status: 409,
        description: 'Company already exists',
    })
    @ApiResponse({
        status: 400,
        description: 'SQL Errors',
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    //@ReturnMessage('valid.COMPANY.CREATED')
    async createCompany(@ActiveUser() user: UserActiveInterface, @Body() companyDto: CreateCompanyDTO) {
        return await this.companyService.createCompany(user, companyDto);
    }

    /**
     *
     * Método para que un dueño de compañía (OWNER) borre una compañía.
     *
     * @param user  Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @param id    ID de la compañía a borrar.
     * @returns     Un objeto de tipo DeleteCompanyOutputDTO con los datos de la compañía borrada o errores de
     *              diferentes tipos dependiendo del conflicto a la hora de borrar.
     */
    @Delete('delete-company/:id')
    @ApiOperation({
        summary: 'Borra una compañía y la relación con todos los usuarios que ' + 'pertenecen a ella (debes ser OWNER)',
    })
    @ApiResponse({
        status: 200,
        description: 'Company successfully deleted',
        type: DeleteCompanyOutputDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'SQL Errors',
    })
    @ApiResponse({
        status: 409,
        type: DeleteCompanyConflicts,
    })
    @ApiParam(CompanyController.COMPANY_IDS)
    //@ReturnMessage('valid.COMPANY.DELETED')
    async deleteCompany(@ActiveUser() user: UserActiveInterface, @Param('id') id: number) {
        return await this.companyService.deleteCompany(user, id);
    }

    /**
     * Método para actualizar la información de la compañía (no sus usuarios) como puede ser el nombre.
     * Es recomendable que en caso de tener lógica para imágenes (logo, banner, icono de compañía) deben
     * ir en un endpoint aparte. Este método solo pueden realizarlo usuarios con permisos de administrador
     * o dueño.
     *
     * @param user      Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @param id        ID de la compañía a actualizar.
     * @param newInfo   Objeto de tipo UpdateCompanyDTO con la información a actualizar.
     * @returns         Un objeto de tipo UpdateCompanyOutputDTO con los datos actualizados de la compañía o errores
     *                  de diferentes tipos dependiendo del tipo de conflicto a la hora de actualizar.
     */
    @Put('update/:id')
    @ApiOperation({
        summary: 'Actualiza la información de la empresa (debes ser OWNER o ADMIN).',
    })
    @ApiResponse({
        status: 200,
        description: 'Company successfully updated',
        type: UpdateCompanyOutputDTO,
    })
    @ApiResponse({
        status: 409,
        type: UpdateCompanyConflics,
    })
    @ApiParam(CompanyController.COMPANY_IDS)
    //@ReturnMessage('valid.COMPANY.UPDATED')
    async updateCompany(
        @ActiveUser() user: UserActiveInterface,
        @Param('id') id: number,
        @Body() newInfo: UpdateCompanyDTO,
    ) {
        return await this.companyService.updateCompany(user, id, newInfo);
    }

    /**
     * Método para añadir un usuario a una compañía ya existente. Este método solo pueden realizarlo usuarios
     * con permisos de administrador o dueño.
     *
     * @param user          Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @param id            ID de la compañía a la que añadir el usuario.
     * @param addInfoDto    Objeto de tipo AddUserDTO con los datos del usuario a añadir.
     * @returns             Objeto de tipo AddUserCompanyOutputDTO con todos los datos del nuevo usuario y datos relevantes
     *                      de la compañía o errores de diferentes tipos dependiendo del conflicto a la hora de añadir al
     *                      usuario.
     */
    @Post('add-user/:id')
    @ApiOperation({
        summary: 'Añade un usuario a una compañía (debes ser OWNER o ADMIN)',
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully added',
        type: AddUserCompanyOutputDTO,
    })
    @ApiResponse({
        status: 409,
        type: AddToCompanyConflicts,
    })
    @ApiParam(CompanyController.COMPANY_IDS)
    //@ReturnMessage('valid.COMPANY.USER_ADDED')
    async addUserToCompany(
        @ActiveUser() user: UserActiveInterface,
        @Param('id') id: number,
        @Body() addInfoDto: AddUserDTO,
    ) {
        return await this.companyService.addUserToCompany(user, id, addInfoDto);
    }

    /**
     * Método para borrar a un usuario de una compañía, se recomienda no borrar permitir borrar al/los dueño/s (OWNER)
     * de la compañía. Este método solo pueden realizarlo usuarios con permisos de administrador o dueño.
     *
     * @param user              Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @param id                ID de la compañía de la que borrar el usuario.
     * @param removeInfoDto     Objeto de tipo RemoveUserDTO con la información del usuario a borrar.
     * @returns                 Objeto de tipo RemoveUserCompanyOutputDTO con la información del usuario borrado y datos
     *                          relevantes de la compañía o diferentes errores dependiendo del conflicto a la hora de
     *                          borrar al usuario.
     */
    @Delete('remove-user/:id')
    @ApiOperation({
        summary: 'Elimina un usuario a una compañía (debes ser OWNER o ADMIN. No puedes borrar al OWNER)',
    })
    @ApiResponse({
        status: 200,
        description: 'User successfully deleted',
        type: RemoveUserCompanyOutputDTO,
    })
    @ApiResponse({
        status: 409,
        type: RemoveUserToCompanyConflicts,
    })
    @ApiParam(CompanyController.COMPANY_IDS)
    //@ReturnMessage('valid.COMPANY.USER_REMOVED')
    async removeUserFromCompany(
        @ActiveUser() user: UserActiveInterface,
        @Param('id') id: number,
        @Body() removeInfoDto: RemoveUserDTO,
    ) {
        return await this.companyService.removeUserFromCompany(user, id, removeInfoDto);
    }

    /**
     * Método para actualizar la información relativa a la compañía de un usuario que se encuentra dentro
     * de ella. Este método solo pueden realizarlo usuarios con permisos de administrador o dueño. No se
     * puede cambiar el rol de dueño (OWNER) mediante este método, el dueño debe delegar la compañía para
     * dejar su rol.
     *
     * @param user      Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @param id        ID de la compañía sobre la que modificar el usuario.
     * @param info      Objeto de tipo UpdateUserCompanyDTO con los datos a modificar.
     * @returns         Objeto de tipo UpdateUserCompanyOutputDTO con los datos relevantes del usuario actualizado y
     *                  la compañia o diferentes errores dependiendo del conflicto a la hora de actualizar el usuario.
     */
    @Put('update-user/:id')
    @ApiOperation({
        summary:
            'Actualiza la información del usuario indicado (debes ser OWNER o ADMIN, no se puede actualizar a un OWNER)',
    })
    @ApiResponse({
        status: 200,
        description: 'User successfully updated',
        type: UpdateUserCompanyOutputDTO,
    })
    @ApiResponse({
        status: 409,
        type: RemoveUserToCompanyConflicts,
    })
    @ApiParam(CompanyController.COMPANY_IDS)
    //@ReturnMessage('valid.COMPANY.USER_UPDATED')
    async updateUserInCompany(
        @ActiveUser() user: UserActiveInterface,
        @Param('id') id: number,
        @Body() info: UpdateUserCompanyDTO,
    ) {
        return await this.companyService.updateUserInCompany(user, id, info);
    }

    /**
     * Método para que un usuario abandone una compañía. No puede ser usado por dueños (OWNER) de la
     * compaía. Si un dueño quiere dejar la compañía, primero debe delegar el rol de dueño sobre otro
     * usuario.
     *
     * @param userInfo  Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @param id        ID de la compañía que abandonará el usuario.
     * @returns         Un objeto de tipo LeaveCompanyOutputDTO con información relevante del usuario y si ha
     *                  logrado abandonar Correctamente la compañía o un error de diferentes tipos dependiendo del
     *                  conflicto generado.
     */
    @Patch('leave/:id')
    @ApiOperation({
        summary: 'Saca al usuario activo de una compañía. (No puede ser el OWNER)',
    })
    @ApiResponse({
        status: 200,
        description: 'Leave successfully',
        type: LeaveCompanyOutputDTO,
    })
    @ApiResponse({
        status: 409,
        type: LeaveCompanyConflict,
    })
    @ApiParam(CompanyController.COMPANY_IDS)
    //@ReturnMessage('valid.COMPANY.LEAVED')
    async leave(@ActiveUser() userInfo: UserActiveInterface, @Param('id') id: number) {
        return await this.companyService.leaveCompany(userInfo, id);
    }

    /**
     * Método para que un dueño (OWNER) de compañía delege el rol en otro usuario. El rol de dueño pasará a
     * ser del otro usuario y el que antes era dueño, ahora será administrador (ADMIN).
     *
     * @param user      Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @param id        ID de la empresa que delegar.
     * @param info      Objeto de tipo DelegateCompanyDTO con la información para delegar.
     * @returns         Un objeto de tipo DelegateCompanyOutputDTO con los datos de los usuarios actualizados o
     *                  diferentes errores dependiendo del tipo de conflicto.
     */
    @Patch('delegate/:id')
    @ApiOperation({
        summary:
            'Da el OWNER de la compañía a otro usuario, debe estar dentro de la compañía. El OWNER anterior pasa a ser ADMIN.',
    })
    @ApiResponse({
        status: 200,
        description: 'Delegate successfully',
        type: DelegateCompanyOutputDTO,
    })
    @ApiResponse({
        status: 409,
        type: DelegateCompanyConflict,
    })
    @ApiParam(CompanyController.COMPANY_IDS)
    //@ReturnMessage('valid.COMPANY.DELEGATED')
    async delegate(@ActiveUser() user: UserActiveInterface, @Param('id') id: number, @Body() info: DelegateCompanyDTO) {
        return await this.companyService.delegateOwner(user, id, info);
    }

    /**
     * Método para solicitar la información de una compañías en especifico de un usuario.
     *
     * @param id        ID de la compañías sobre la que solicitar información.
     * @param user      Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @returns         Objeto de tipo CompanyInfoOutputDTO con los datos de la compañías sobre la que se solicita
     *                  la consulta o diferentes errores dependiendo del conflicto.
     */
    @Get('info/:id')
    @ApiOperation({
        summary: 'Devuelve la información de la compañía solicitada.',
    })
    @ApiResponse({
        status: 200,
        description: 'Data fetch successfully',
        type: CompanyInfoOutputDTO,
    })
    @ApiResponse({
        status: 409,
        description: 'The user is not in the company.',
    })
    @ApiParam(CompanyController.COMPANY_IDS)
    //@ReturnMessage('valid.COMPANY.INFO_RETURNED')
    async getInfo(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
        return await this.companyService.companyInfo(user, id);
    }

    /**
     *Método para obtener la información de todas las compañías a las que pertenece un usuario.
     *
     * @param user      Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @returns         Objeto de tipo AllCompanyInfoOutputDTO con la información de todas las compañías del
     *                  usuario. El array devuelto puede estar vacío.
     */
    @Get('companies-paginated')
    @ApiOperation({ summary: 'Devuelve las compañias del usuarios regsitrado paginadas' })
    @ApiResponse({
        status: 200,
        description: 'Data fetch successfully',
        type: AllCompanyInfoOutputDTO,
    })
    @ApiResponse({ status: 400, description: 'Invalid query parameters' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiQuery({
        name: 'name',
        description: 'Nombre de la compañía a buscar',
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
        example: ['name:desc'],
    })
    //@ReturnMessage('valid.COMPANY.FETCHED')
    async getPaginatedMyCompanies(
        @ActiveUser() user: UserActiveInterface,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
        @Query('sort', new OrderPipe(OrderCompany)) order: OrderDTO<OrderCompany>[],
        @Query('name') name?: string,
    ) {
        return await this.companyService.myCompaniesPaginated(user, page, pageSize, order, name);
    }

    /**
     * Método para obtener la información paginada de las compañías y todos lso usuarios.
     *
     * @param page      Número de página (por defecto 1).
     * @param pageSize  Tamaño de página (por defecto 10).
     * @returns         Objeto de tipo PaginatedCompanyOutputDTO.
     */
    @Get('all-companies-pagination')
    @Auth(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'SUPER_ADMIN: Devuelve todas las compañías de la plataforma con sus usuarios paginadas' })
    @ApiResponse({
        status: 200,
        description: 'Data fetch successfully',
        type: AllCompanyInfoOutputDTO,
    })
    @ApiResponse({ status: 400, description: 'Invalid query parameters' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiQuery({
        name: 'name',
        description: 'Nombre de la compañía a buscar',
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
        example: ['name:desc'],
    })
    //@ReturnMessage('valid.COMPANY.FETCHED')
    async getAllCompaniesPaginated(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
        @Query('sort', new OrderPipe(OrderCompany)) order: OrderDTO<OrderCompany>[],
        @Query('name') name?: string,
    ): Promise<PaginatedResponse<CompanyDTO>> {
        return this.companyService.getAllCompaniesPaginated(page, pageSize, order, name);
    }

    /**
     * Método para comprobar si el usuario es el único usuario dentro de una compañía que tiene el rol de dueño
     * (OWNER). Se usa para comprobar parámetros de seguridad en caso de borrar la compañía o mandar avisos en
     * el front. Devolverá un objeto del tipo LastOwnerOutputDTO con una propiedad "isLastOwner" boolean que puede
     * estar a true o false, si es o no el último dueño. En caso de serlo, devuelve también un array con la información
     * de todas las compañías de las que es el último dueño.
     *
     * @param user      Objeto de tipo UserActiveInterface con la información del usuario que lanza el endpoint.
     * @returns         Objeto de tipo LastOwnerOutputDTO con la información del usuario y sus compañías de las que
     *                  es el último dueño (OWNER).
     */
    @Get('last-owner')
    @ApiOperation({
        summary: 'Consulta si el usuario es el último dueño (OWNER) de alguna compañía',
    })
    @ApiResponse({
        status: 200,
        description: 'Data fetch successfully',
        type: LastOwnerOutputDTO,
    })
    //@ReturnMessage('valid.COMPANY.OWNER_FETCHED')
    async checkLastOwner(@ActiveUser() user: UserActiveInterface) {
        return await this.companyService.checkLastOwner(user);
    }
}
