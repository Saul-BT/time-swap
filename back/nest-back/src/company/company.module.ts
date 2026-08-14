import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { UserCompany } from './entities/user-company.entity';
//import SeederModule from 'src/seeder/seeder.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        //forwardRef(() => SeederModule),
        TypeOrmModule.forFeature([Company]), // Tabla Company de la BD
        TypeOrmModule.forFeature([UserCompany]), // Tabla de relación usuario/compañía de la BD
        /**
         * El módulo Auth también usa CompanyModule dentro del auth.service para poder contar
         * la cantidad de compañías que tiene un usuario al iniciar sesión en la plataforma. Por
         * ello, el módulo Auth debe ir con forwardRef.
         */
        forwardRef(() => AuthModule),
    ],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [TypeOrmModule, CompanyService],
})
export class CompanyModule {}
