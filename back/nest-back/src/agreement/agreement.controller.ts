import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { AgreementService } from './agreement.service';
import { AgreementOutputDto } from './dto-outputs/agreement.output.dto';
import { AcceptAgreementDto } from './dto/accept-agreement.dto';
import { AgreementTermsDto } from './dto/agreement-terms.dto';
import { ProposeAgreementDto } from './dto/propose-agreement.dto';

@Controller('agreement')
export class AgreementController {
    constructor(private readonly agreementService: AgreementService) {}

    // Proponer un acuerdo en una conversación (versión 1)
    @Post()
    @Auth(Role.USER, Role.ADMIN)
    propose(
        @Body() dto: ProposeAgreementDto,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<AgreementOutputDto> {
        return this.agreementService.propose(dto, user);
    }

    // El acuerdo abierto de una conversación
    @Get('conversation/:conversationId')
    @Auth(Role.USER, Role.ADMIN)
    findByConversation(
        @Param('conversationId', ParseIntPipe) conversationId: number,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<AgreementOutputDto> {
        return this.agreementService.findByConversation(conversationId, user);
    }

    // Ver un acuerdo con todas sus versiones
    @Get(':id')
    @Auth(Role.USER, Role.ADMIN)
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<AgreementOutputDto> {
        return this.agreementService.findOne(id, user);
    }

    // Contrapropuesta: crea una versión nueva
    @Post(':id/counter')
    @Auth(Role.USER, Role.ADMIN)
    counter(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AgreementTermsDto,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<AgreementOutputDto> {
        return this.agreementService.counter(id, dto, user);
    }

    // Aceptar una versión concreta
    @Post(':id/accept')
    @Auth(Role.USER, Role.ADMIN)
    accept(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AcceptAgreementDto,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<AgreementOutputDto> {
        return this.agreementService.accept(id, dto, user);
    }

    // Abandonar antes de que se active
    @Post(':id/cancel')
    @Auth(Role.USER, Role.ADMIN)
    cancel(
        @Param('id', ParseIntPipe) id: number,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<AgreementOutputDto> {
        return this.agreementService.cancel(id, user);
    }
}