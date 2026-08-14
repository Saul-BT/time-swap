import { Module, UseGuards } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from '../user/user.module';
import { ExamplesController } from './examples.controller';
import { LangExampleService } from './services/lang.example.service';

@UseGuards(ThrottlerGuard)
@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'), // Valor del .env
                signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION') ?? '15m'                }, // Valor del .env
                global: configService.get<boolean>('JWT_GLOBAL'), // Valor del .env
            }),
            inject: [ConfigService],
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // Valor en MS, 60.000 es 1 minuto
                limit: 10, // Cantidad de accesos asignados. Recomendado: 10 cada 1 minuto (60.000ms)
            },
        ]),
    ],
    controllers: [ExamplesController],
    providers: [LangExampleService], // Servicios
    exports: [],
})
export class ExamplesModule {}
