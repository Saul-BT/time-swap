import { OmitType, PartialType, PickType } from "@nestjs/swagger";
import CreateReviewDto from "./create-review.dto";

export default class UpdateReviewDto extends PartialType(
    OmitType(CreateReviewDto, ['listingId'])
) {}