import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TemporalOtp } from './entities/temporal-2fa.entity';
import { CompanyModule } from 'src/company/company.module';
//import SeederModule from 'src/seeder/seeder.module';
import { UserLoginService } from './services/user-login.service';
import { LoginLog } from '../auth/entities/user-login-log.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), // Tabla user de la BD
        TypeOrmModule.forFeature([TemporalOtp]), // Tabla para OneTimePasswords
        TypeOrmModule.forFeature([LoginLog]), // Tabla para logs de login
        forwardRef(() => AuthModule),
        forwardRef(() => CompanyModule),
        //forwardRef(() => SeederModule),
    ],
    controllers: [UserController],
    providers: [UserService, UserLoginService],
    exports: [TypeOrmModule, UserService, UserLoginService],
})
export class UserModule {}
