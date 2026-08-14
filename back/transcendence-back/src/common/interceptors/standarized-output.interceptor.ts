/*import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, StreamableFile } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseWrapperDTO } from '../dtos/message-output.dto';
import { I18nService } from 'nestjs-i18n';
import { I18N_RETURN_MESSAGE } from '../decorators/wrap-endpoint.decorator';
import { I18nPath, I18nTranslations } from 'src/i18n/generated/i18n.generated';

@Injectable()
export class WrapperInterceptor implements NestInterceptor {
    private readonly logger = new Logger(WrapperInterceptor.name);

    constructor(
        private readonly reflector: Reflector,
        private readonly i18n: I18nService<I18nTranslations>,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        let retMessage = this.reflector.getAllAndOverride<{ message: I18nPath; args: any[] }>(I18N_RETURN_MESSAGE, [
            context.getHandler(),
            context.getClass(),
        ]);

        return next.handle().pipe(
            map((data) => {
                // Si es un archivo se devuelve sin envolver
                if (data instanceof StreamableFile) return data;

                // Si ya se ha generado un mensaje de respuesta devolverlo
                if (data instanceof ResponseWrapperDTO) return data;

                // Si no crearlo con un nuevo mensaje
                const messageOut = new ResponseWrapperDTO<typeof data>();
                if (!retMessage) {
                    retMessage = { message: 'error.INTERNAL.NOT_ESPECIFIED_MESSAGE', args: undefined };
                    this.logger.error(`RESPONSE WRAPPER INTERCEPTOR: No message received for endpoint ${request.url}`);
                }
                messageOut.message = this.i18n.t(retMessage.message, { args: retMessage.args });
                messageOut.result = data;
                return messageOut;
            }),
        );
    }
}*/
