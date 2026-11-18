import { IntersectionType } from "@nestjs/swagger";
import { ReviewDescriptionDto, ReviewScoreDto } from "./components-review.dto";
import { ListingIdDto } from "./components-listing.dto";

export default class CreateReviewDto extends IntersectionType(
    ListingIdDto,
    ReviewScoreDto,
    ReviewDescriptionDto,
) {}