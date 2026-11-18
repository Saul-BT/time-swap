import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { ConversationService } from './conversation.service';
import { ConversationOutputDto } from './dto-outputs/conversation.output.dto';
import { MessageOutputDto } from './dto-outputs/message.output.dto';
import { OpenConversationDto } from './dto/open-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('conversation')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    // Crear o recuperar la conversación de un anuncio
    @Post('open')
    @Auth(Role.USER, Role.ADMIN)
    open(
        @Body() dto: OpenConversationDto,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<ConversationOutputDto> {
        return this.conversationService.open(dto, user);
    }

    // Mis conversaciones
    @Get()
    @Auth(Role.USER, Role.ADMIN)
    findMine(@ActiveUser() user: UserActiveInterface): Promise<ConversationOutputDto[]> {
        return this.conversationService.findMine(user);
    }

    // Mensajes de una conversación (también para recargar)
    @Get(':id/messages')
    @Auth(Role.USER, Role.ADMIN)
    getMessages(
        @Param('id', ParseIntPipe) id: number,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<MessageOutputDto[]> {
        return this.conversationService.getMessages(id, user);
    }

    // Enviar un mensaje
    @Post(':id/messages')
    @Auth(Role.USER, Role.ADMIN)
    sendMessage(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: SendMessageDto,
        @ActiveUser() user: UserActiveInterface,
    ): Promise<MessageOutputDto> {
        return this.conversationService.sendMessage(id, dto, user);
    }
}