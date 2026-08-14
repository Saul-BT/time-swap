import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SeederService } from './seeder.service';
import { CompanyModule } from 'src/company/company.module';
//import FileModule from 'src/files/files.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => CompanyModule),
        //forwardRef(() => FileModule),
    ],
    providers: [SeederService],
    exports: [SeederService],
})
export default class SeederModule {}
