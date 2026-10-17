import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { Exchange } from './entities/exchange.entity';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Exchange]),
    ],
    controllers: [ExchangeController],
    providers: [ExchangeService],
    exports: [TypeOrmModule, ExchangeService],
})
export class ExchangeModule {}
