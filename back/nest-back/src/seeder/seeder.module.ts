import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SeederService } from './seeder.service';
import { CompanyModule } from 'src/company/company.module';
import { CategoryModule } from 'src/category/category.module';
import { ExchangeModule } from 'src/exchange/exchange.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => CategoryModule),
        forwardRef(() => ExchangeModule),
    ],
    providers: [SeederService],
    exports: [SeederService],
})
export default class SeederModule {}
