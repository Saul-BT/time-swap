import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/auth/guard/optional-auth.guard';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { PublicProfileDto } from './dto/public-profile.dto';
import { ProfileService } from './profile.service';

/**
 * Endpoint de consulta del perfil público (sub-issue #23 de #22). Ruta
 * pública: acepta tanto visitantes sin sesión como miembros autenticados,
 * y varía la respuesta según quién pregunta (OptionalAuthGuard).
 */
@ApiTags('profile - Perfil público de miembro (issue #22)')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @ApiOperation({ summary: 'Consultar el perfil público de un miembro' })
    @ApiParam({ name: 'userId', type: Number })
    @ApiResponse({ status: 200, description: 'Perfil filtrado según quién pregunta.', type: PublicProfileDto })
    @UseGuards(OptionalAuthGuard)
    @Get(':userId')
    async getPublicProfile(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() request: { user?: UserActiveInterface },
    ): Promise<PublicProfileDto> {
        return this.profileService.getPublicProfile(userId, request.user);
    }
}