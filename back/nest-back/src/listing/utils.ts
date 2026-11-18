import { ErrorManager } from "src/common/error-handling/error.manager";
import { ListingOutputDto } from "./dto-outputs/listing.output.dto";
import { ReviewOutputDto } from "./dto-outputs/review.output.dto";
import { Listing } from "./entities/listing.entity";
import { Review } from "./entities/review.entity";

export function mapReviewOutput(review: Review): ReviewOutputDto {
        return {
            id: review.id,
            score: review.score,
            authorId: review.author.id,
            reviewedId: review.reviewedUser.id,
            description: review.description,
            createdAt: review.createdAt
        }
}

export function mapListingOutput(listing: Listing): ListingOutputDto {
    const result: ListingOutputDto = {
        id: listing.id,
        title: listing.title,
        summary: listing.description,
        kind: listing.kind,
        mode: listing.mode,
        byline: `${listing.author.name} · ${listing.location ?? listing.category.name}`,
        hours: listing.duration,
        authorId: listing.author.id,
        authorName: listing.author.name ?? '',
        categoryId: listing.category.id,
        categoryName: listing.category.name,
        status: listing.status,
        createdAt: listing.createdAt
    };

    for (const review of listing.reviews) {
        if (review.author.id === listing.author.id && review.reviewedUser.id === listing.other.id) {
            if (result.reviewByAuthor) {
                throw new ErrorManager("INTERNAL_SERVER_ERROR", "Duplicated review");
            }
            result.reviewByAuthor = mapReviewOutput(review);
        }
        else if (review.author.id === listing.other.id && review.reviewedUser.id === listing.author.id) {
            if (result.reviewByOther) {
                throw new ErrorManager("INTERNAL_SERVER_ERROR", "Duplicated review");
            }
            result.reviewByOther = mapReviewOutput(review);
        }
        else {
            throw new ErrorManager("INTERNAL_SERVER_ERROR", "Unrelated review");
        }
    }

    return result;
    }