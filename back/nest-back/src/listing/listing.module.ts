import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Listing } from './entities/listing.entity';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';

@Module({
    imports: [TypeOrmModule.forFeature([Listing]), forwardRef(() => AuthModule)],
    controllers: [ListingController],
    providers: [ListingService],
})
export class ListingModule {}