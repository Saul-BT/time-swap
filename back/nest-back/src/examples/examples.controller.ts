import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParamOptions, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/role.enum';
import { LangExampleService } from './services/lang.example.service';
import { ReturnMessage } from 'src/common/decorators/wrap-endpoint.decorator';


@ApiTags('examples - Ejemplos de uso de servicios en back')
@ApiBearerAuth()
@Auth(Role.SUPER_ADMIN)
@Controller('examples')
export class ExamplesController {
    static readonly LANG_SELECTOR: ApiParamOptions = {
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
    };

    constructor(private readonly langExampleService: LangExampleService) {}

    @Get('simple-manual')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve un mensaje en un idioma que puede cambiar por header',
    })
    @UseGuards(ThrottlerGuard)
    @ApiHeader(ExamplesController.LANG_SELECTOR)
    @ReturnMessage('valid.EXAMPLE.WELCOME')
    async getWelcome() {
        return await this.langExampleService.getSimpleMessageByLang();
    }

    @Get('simple-auto')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve un mensaje en el idioma del usuario',
    })
    @UseGuards(ThrottlerGuard)
    @ReturnMessage('valid.EXAMPLE.SIMPLE_MESSAGE')
    async getUserWelcome() {
        return await this.langExampleService.getSimpleMessageByUser();
    }

    @Get('all-messages-manual')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve todos los mensajes en un idioma específico',
    })
    @UseGuards(ThrottlerGuard)
    @ApiHeader(ExamplesController.LANG_SELECTOR)
    @ReturnMessage('valid.EXAMPLE.RETURN_SPECIFIED_LANGUAGE')
    async getAllMessagesByLang() {
        return await this.langExampleService.getAllMessagesByLang();
    }

    @Get('all-messages-auto')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve todos los mensajes en el idioma del usuario',
    })
    @UseGuards(ThrottlerGuard)
    @ReturnMessage('valid.EXAMPLE.RETURNED_USER_LANGUAGE')
    async getAllMessagesByUser() {
        return await this.langExampleService.getAllMessagesByUser();
    }

    @Get('variable-message')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve un mensaje con una variable',
    })
    @UseGuards(ThrottlerGuard)
    @ApiHeader(ExamplesController.LANG_SELECTOR)
    @ReturnMessage('valid.EXAMPLE.RETURNED_MESSAGE_VARIABLE')
    async getVariableMessage(@Query('variable') variable: string) {
        return await this.langExampleService.getVariableMessageByLang(variable);
    }

    @Get('array-message')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve un mensaje con un array',
    })
    @UseGuards(ThrottlerGuard)
    @ApiHeader(ExamplesController.LANG_SELECTOR)
    @ReturnMessage('valid.EXAMPLE.RETURNED_MESSAGE_ARRAY')
    async getArrayMessage() {
        return await this.langExampleService.getArrayMessageByLang();
    }

    @Get('nested-message')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve un mensaje con estructura anidada',
    })
    @UseGuards(ThrottlerGuard)
    @ApiHeader(ExamplesController.LANG_SELECTOR)
    @ReturnMessage('valid.EXAMPLE.RETURNED_MESSAGE_NESTED')
    async getNestedMessage() {
        return await this.langExampleService.getNestedMessageByLang();
    }

    @Get('complex-message')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve un mensaje complejo con dos variables',
    })
    @UseGuards(ThrottlerGuard)
    @ApiHeader(ExamplesController.LANG_SELECTOR)
    @ReturnMessage('valid.EXAMPLE.RETURNED_MESSAGE_TWO_VARS')
    async getComplexMessage(@Query('variable1') variable1: string, @Query('variable2') variable2: string) {
        return await this.langExampleService.getComplexMessageByLang(variable1, variable2);
    }

    @Get('array-position')
    @ApiOperation({
        summary: 'SUPER_ADMIN: Devuelve una posición específica del array',
    })
    @UseGuards(ThrottlerGuard)
    @ApiHeader(ExamplesController.LANG_SELECTOR)
    @ReturnMessage('valid.EXAMPLE.RETURNED_MESSAGE_POS')
    async getArrayPosition(@Query('position') position: number) {
        return await this.langExampleService.getArrayPositionByLang(position);
    }
}
