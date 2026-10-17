import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Role } from "src/common/enums/role.enum";


@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('company - Consulta de información sobre las compañias')
@Auth(Role.USER, Role.ADMIN)
@Controller('exchange')
export class ExchangeController {
}
