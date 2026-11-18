import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { Listing } from './entities/listing.entity';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        forwardRef(() => CategoryModule),
        TypeOrmModule.forFeature([Listing, Review]),
    ],
    controllers: [ListingController, ReviewController],
    providers: [ListingService, ReviewService],
    exports: [TypeOrmModule, ListingService, ReviewService],
})
export class ListingModule {}