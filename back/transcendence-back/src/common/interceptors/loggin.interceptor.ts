import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
//import { AuditLogService } from '../services/logging.service';
import { LogAudit } from '../interfaces/logger.interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ParseFunctions } from '../functions/parse-functions';
import { ENABLE_LOGGING } from '../decorators/loggin.decorator';

@Injectable()
export class LogginInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        //private readonly logginService: AuditLogService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Parsea los datos de la peticion y respuesta y llama al método de logginService
     * @param req
     * @param res
     * @param reqTime
     */
    async audtiLog(req: any, res: any, reqTime: number) {
        const { method, originalUrl } = req;
        const resTime = new Date().getTime() - reqTime;
        const statusCode = res.statusCode;

        const log: LogAudit = {
            method: method,
            endpoint: originalUrl,
            timestamp: new Date().toISOString(),
            msProcTime: resTime,
            status: statusCode,
            hasJWT: false,
            isValidJWT: false,
            JWTValdError: '',
            JWTInfo: undefined,
            ip: req.ip,
            headers: req.headers,
            body: req.body,
        };

        // Parsear token de usuario si existe
        const token = AuthGuard.extractTokenFromHeader(req);
        if (token) {
            log.hasJWT = true;
            try {
                const payload = this.jwtService.verify(token, {
                    secret: process.env.JWT_SECRET,
                });
                log.JWTInfo = payload;
                log.isValidJWT = true;
            } catch (error: unknown) {
                log.JWTValdError = error instanceof Error ? error.message : 'Unknown JWT validation error';
                // Parse content of JWT
                try {
                    log.JWTInfo = ParseFunctions.decodeJWT(token);
                } catch (e) {
                    // Error silencioso al decodificar JWT
                }
            }
        }

        // Enviar al servicio de logging
        //await this.logginService.log(log);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Verificar si el endpoint está marcado para loguear
        const shouldLog = this.reflector.getAllAndOverride<boolean>(ENABLE_LOGGING, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si no está marcado con @EnableLogging() y no está habilitado globalmente, no loguear
        if (!shouldLog && process.env.AUDIT_LOG_EVERY_ENDPOINT !== 'true') {
            return next.handle();
        }

        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const reqTime = new Date().getTime();

        return next.handle().pipe(
            tap({
                next: () => {
                    this.audtiLog(req, res, reqTime);
                },
                error: () => {
                    this.audtiLog(req, res, reqTime);
                },
            }),
        );
    }
}
