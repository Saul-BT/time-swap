import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { ErrorManager } from './common/error-handling/error.manager';
import { GlobalErrorInterceptor } from './common/error-handling/global-error.interceptor';
//import { SeederService } from './seeder/seeder.service';
import { AuthPlugin, buildAuthTokensSwagger } from './common/swagger/auth.plugin';
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from './common/interfaces/user-active.interface';
import { User } from './user/entities/user.entity';
import { Repository } from 'typeorm';
import { ValidationError } from 'class-validator';
//import { AuditLogService } from './common/services/logging.service';
import { LogginInterceptor } from './common/interceptors/loggin.interceptor';
import { EndpointLogInterceptor } from './common/interceptors/endpoints-log.interceptor';
import { CollapsePlugin } from './common/swagger/collapse.plugin';

async function bootstrap() {
    const envFile = `.env.${process.env.NODE_ENV || 'development'}`; // Recuperar el nombre del .env
    dotenv.config({ path: envFile }); // Configurar la variable global para el .env

    const app = await NestFactory.create(AppModule); // Generación de módulos
    const logger = new Logger('Bootstrap');

    app.setGlobalPrefix('api/v1'); // Ruta general para end-points
    app.useGlobalInterceptors(new GlobalErrorInterceptor()); // Configura un interceptor global para manejar y centralizar el control de errores en toda la aplicación
    /*app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            stopAtFirstError: true,
            //personalizar el mensaje de error que lanza la validación
            exceptionFactory: (errors: ValidationError[]) => {
                const messages = errors.map((err) => {
                    // se obtiene cada mensaje fallido
                    const constraints = Object.values(err.constraints || {}).map((msg) => {
                        if (typeof msg === 'string') {
                            const [i18nKey, rawArgs] = msg.split('|');

                            if (i18nKey?.includes('.')) {
                                try {
                                    const args = rawArgs ? JSON.parse(rawArgs) : {};

                                    return i18n.t(i18nKey, { args: args });
                                } catch (err) {
                                    logger.error('Error while trying to translate error message', err);
                                    return i18nKey;
                                }
                            }
                        }

                        return msg;
                    });

                    return constraints.join(', ');
                });

                // Devolvemos un error usando tu clase personalizada ErrorManager
                return new ErrorManager('BAD_REQUEST', messages.join('; '));
            },
        }),
    );*/
    app.use(helmet());
    app.enableCors({
        origin: 'http://localhost:3000', //todo get frontend url from .env
        credentials: true
    }); // Activar Cors

    const swaggerDocBuilder = new DocumentBuilder() // Datos para mostrar en Swagger y funcionamiento general
        .setTitle('TEMPLATE API') // @CAMBIAR
        .setDescription('API DE TEMPLATE') // @CAMBIAR
        .setVersion('1.0')
        .addBearerAuth({
            name: 'Authorization',
            bearerFormat: 'Bearer',
            scheme: 'Bearer',
            type: 'http',
            in: 'Header',
        });

    const config = swaggerDocBuilder.build();
    const swaggerOptions: Record<string, unknown> = {
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
    };

    // Construimos el objeto del Seeder y lanzamos el método para poblar de datos la BD
    //const seeder: SeederService = app.get(SeederService);
    //await seeder.seed();

    /**
     * Plugin de swagger para conectar con usuarios
     * @FIXME QUITAR PLUGIN ANTES DE PRODUCCION
     * @TODO  QUITAR PLUGIN ANTES DE PRODUCCION
     */
    if (envFile === '.env.development' && process.env.USE_AUTO_AUTH_PLUGIN === 'true') {
        logger.warn('!WARNING! -- Using auth plugin - only use this on development env -- !WARNING!');
        const userRepo = app.get<Repository<User>>(`${User.name}Repository`);
        const users: User[] = await userRepo.find(); // Conseguimos todos los usuarios de BD

        const loginPayloads = await Promise.all(
            users.map(async (user) => {
                const userActive: UserActiveInterface = {
                    id: user.id,
                    mail: user.mail,
                    role: user.role,
                    name: user.name ?? '',
                    validated: !user.twoFactorCode,
                    language: user.language,
                };
                return userActive;
            }),
        );

        const customTokens = buildAuthTokensSwagger(app.get(JwtService), process.env.JWT_SECRET ?? 'changeme', loginPayloads); // Autorizaciones para debug en swagger
        swaggerDocBuilder.addExtension('x-custom-tokens', customTokens);
        swaggerDocBuilder.addExtension('x-themes', [
            {
                name: 'Light',
                css: `body { background-color: white; color: black; }`,
            },
            {
                name: 'Dark',
                css: `body { background-color: #121212; color: #eee; }`,
            },
        ]);
        swaggerOptions['plugins'] = [AuthPlugin, CollapsePlugin];
        swaggerOptions['persistAuthorization'] = true; // Activa el uso de cookies para la autorizacion de swagger

        // Se saca por pantalla la info de los endpoints lanzados, solo para desarrollo
        app.useGlobalInterceptors(new EndpointLogInterceptor());
    }

    // CSS theme para swagger
    const cssPath = path.join('./assets/swagger/SwaggerDark.css');
    const customCss = fs.readFileSync(cssPath, 'utf8');
    // Despliegue del swagger
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
        swaggerOptions: swaggerOptions,
        customCss: customCss,
    });

    // Configuramos el interceptor de logs condicional
    const reflector = app.get(Reflector);
    //const auditLogService = app.get(AuditLogService);
    const jwtService = app.get(JwtService);

    // Registramos el interceptor global para logs (se añade siempre, el interceptor verifica si esta habilitado o no)
    //const logginInterceptor = new LogginInterceptor(reflector, auditLogService, jwtService);
    //app.useGlobalInterceptors(logginInterceptor);

    await app.listen(parseInt(process.env.APP_PORT ?? '8000')); // Puertos de escucha de la app
}

bootstrap().then(
    (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        r, // Arranque de la APP
    ) =>
        console.log(
            'NestJS server running on port ' + (process.env.APP_PORT || '8000'), // Mensaje de confirmación por consola para debug
        ),
);
