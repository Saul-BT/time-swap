import { forwardRef, Module, UseGuards } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import MailModule from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { Verification } from './entities/verification.entity';
import { AuthService } from './services/auth.service';
import { ResetService } from './services/reset.service';
import { BullModule } from '@nestjs/bull';

@UseGuards(ThrottlerGuard)
@Module({
    imports: [
        BullModule.registerQueue({
            name: 'mail-queue',
        }),
        ConfigModule,
        forwardRef(() => MailModule),
        CompanyModule,
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Verification]), // Tabla verification de la BD
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
    controllers: [AuthController],
    providers: [AuthService, ResetService],
    exports: [JwtModule, TypeOrmModule, AuthService],
})
export class AuthModule {}
