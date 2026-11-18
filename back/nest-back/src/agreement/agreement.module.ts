import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AgreementController } from './agreement.controller';
import { AgreementService } from './agreement.service';
import { AgreementAcceptance } from './entities/agreement-acceptance.entity';
import { AgreementVersion } from './entities/agreement-version.entity';
import { Agreement } from './entities/agreement.entity';
import { Exchange } from './entities/exchange.entity';
import { Obligation } from './entities/obligation.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Agreement,
            AgreementVersion,
            AgreementAcceptance,
            Exchange,
            Obligation,
        ]),
        forwardRef(() => AuthModule),
    ],
    controllers: [AgreementController],
    providers: [AgreementService],
})
export class AgreementModule {}