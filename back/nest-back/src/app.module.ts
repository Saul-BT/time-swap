import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
//import { DevicesModule } from './example-crud/devices/devices.module';
//import { ExamplesModule } from './examples/examples.module';
import MailModule from './mail/mail.module';
import { NodemailerModule } from './mail/node-transporter.module';
//import SeederModule from './seeder/seeder.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
//import { WrapperInterceptor } from './common/interceptors/standarized-output.interceptor';
//import { JwtLanguageResolver } from './common/services/jwt-language-solver';
import { JwtModule } from '@nestjs/jwt';
import { validateEnv } from './common/validator/env.validator';
//import { AuditLogService } from 'src/common/services/logging.service';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`; // Recuperar el nombre del .env
dotenv.config({ path: envFile }); // Configurar la variable global para el .env

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env', // Carga variables de .env
            validate: validateEnv,
            isGlobal: true,
            ignoreEnvVars: true, // Ignora env variables no listadas en el archivo .env
            ignoreEnvFile: false, // Nunca ignora el archivo .env
        }),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
            },
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig: TypeOrmModuleOptions = {
                    type: configService.getOrThrow<string>('BBDD_CONNECTION') as any,
                    host: configService.getOrThrow<string>('BBDD_HOST'),
                    port: configService.getOrThrow<number>('POSTGRESQL_DOCKER_PORT'),
                    username: configService.getOrThrow<string>('POSTGRESQL_DOCKER_USER'),
                    password: configService.getOrThrow<string>('POSTGRESQL_DOCKER_ROOT_PASSWORD'),
                    database: configService.getOrThrow<string>('POSTGRESQL_DATABASE_NAME'),
                    autoLoadEntities: true,
                    synchronize: configService.getOrThrow<string>('BBDD_SYNCHRONIZE') === 'development', // Valor comparado contra el .env
                    //ssl: configService.getOrThrow<boolean>('BBDD_SSL'), // Valor comparado contra el .env
                    ssl: false, //todo support ssl with certificate in deployment
                    extra: {
                        /*ssl: configService.getOrThrow<boolean>('BBDD_SSL') // Valor comparado contra el .env
                            ? { rejectUnauthorized: false }
                            : null,*/
                        ssl: false //todo support ssl with certificate in deployment
                    },
                    //logging: ['query', 'error', 'schema'], // Logs detallados
                };
                return dbConfig;
            },
        }),
        /*I18nModule.forRootAsync({
            // Módulo de idiomas
            useFactory: (configService: ConfigService) => ({
                fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'), // Valor en el .env
                loaderOptions: {
                    path: join(__dirname, '/i18n/'), // Carpeta de idiomas
                    watch: true,
                },
                typesOutputPath: path.join(process.cwd(), './src/i18n/generated/i18n.generated.ts'),
            }),
            resolvers: [
                JwtLanguageResolver,
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
                new HeaderResolver(['x-lang']),
            ],
            inject: [ConfigService],
            imports: [JwtModule],
        }),*/
        AuthModule,
        UserModule,
        //DevicesModule,
        //SeederModule,
        //ExamplesModule,
        CompanyModule,
        NodemailerModule,
        //I18nValidatorModule,
        MailModule,
    ],
    exports: [],
    controllers: [],
    providers: [
        Reflector,
        //{ provide: APP_INTERCEPTOR, useClass: WrapperInterceptor },
        //AuditLogService,
        //JwtLanguageResolver,
    ], // Interceptor global que envuelve los mensajes antes de enviarlos
})
export class AppModule {}
