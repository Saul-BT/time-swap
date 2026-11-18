import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { Review } from "./entities/review.entity";
import { ListingService } from "./listing.service";
import CreateReviewDto from "./dto/create-review.dto";
import UpdateReviewDto from "./dto/update-review.dto";
import { ReviewOutputDto } from "./dto-outputs/review.output.dto";
import { ErrorManager } from "src/common/error-handling/error.manager";
import { mapReviewOutput } from "./utils";
import { Role } from "src/common/enums/role.enum";


@Injectable()
export class ReviewService {
    private readonly logger = new Logger(ReviewService.name);

    constructor (
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @Inject(ListingService)
        private readonly listingService: ListingService,
    ) {}

    async create(user: UserActiveInterface, createDto: CreateReviewDto) {
        const review = this.reviewRepository.create();

        const listing = await this.listingService.getByIdRaw(createDto.listingId);
        review.listing = listing;

        if (user.id === listing.author.id) {
            review.author = listing.author;
            review.reviewedUser = listing.other;
        }
        else if (user.id === listing.other.id) {
            review.author = listing.other;
            review.reviewedUser = listing.author;
        }
        else {
            throw new ErrorManager('FORBIDDEN', 'Unrelated user cannot create review');
        }

        for (const existingReview of listing.reviews) {
            if (review.author.id === existingReview.author.id) {
                throw new ErrorManager('CONFLICT', 'Review already exists');
            }
        }

        review.score = createDto.score;
        review.description = createDto.description;
        
        return mapReviewOutput(await this.reviewRepository.save(review));
    }

    async update(user: UserActiveInterface, id: number, updateDto: UpdateReviewDto) {
        //all properties in dto are optional, need to check its not empty first
        if (!Object.values(updateDto).some(value => value !== undefined)) {
            throw new ErrorManager('BAD_REQUEST', 'Empty DTO');
        }

        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: { author: true }
        })

        if (!review) {
            throw new ErrorManager('NOT_FOUND', 'Review not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== review.author.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to modify review');
        }

        if (updateDto.score) review.score = updateDto.score;
        if (updateDto.description) review.description = updateDto.description;

        return mapReviewOutput(await this.reviewRepository.save(review));
    }

    async getById(id: number): Promise<ReviewOutputDto> {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: { author: true, reviewedUser: true }
        })

        if (!review) {
            throw new ErrorManager('NOT_FOUND', 'Review not found');
        }

        return mapReviewOutput(review);
    }

    async remove(user:UserActiveInterface, id: number) {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: { author: true }
        })

        if (!review) {
            throw new ErrorManager('NOT_FOUND', 'Review not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== review.author.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to delete review');
        }

        return this.reviewRepository.remove(review);
    }
}