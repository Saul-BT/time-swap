import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { Listing } from './entities/listing.entity';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        forwardRef(() => CategoryModule),
        TypeOrmModule.forFeature([Listing]),
    ],
    controllers: [ListingController],
    providers: [ListingService],
    exports: [TypeOrmModule, ListingService],
})
export class ListingModule {}