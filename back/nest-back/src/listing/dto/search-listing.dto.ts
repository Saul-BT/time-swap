//todo for values with ranges (like duration and start time) allow for a range search with min and max

import { IntersectionType, PartialType } from "@nestjs/swagger";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CategoryIdArrayDto } from "src/category/dto/components.dto";
import { ListingDescriptionDto, ListingDurationDto, ListingHigherStartTimeDto, ListingKindDto, ListingLowerStartTimeDto, ListingModeDto, ListingStatusDto, ListingTitleDto } from "./components.dto";

export class SearchListingDTO extends IntersectionType(
    PaginationDto,
    PartialType(ListingTitleDto),
    PartialType(ListingDescriptionDto),
    PartialType(ListingKindDto),
    PartialType(ListingModeDto),
    ListingStatusDto,
    ListingLowerStartTimeDto,
    ListingHigherStartTimeDto,
    PartialType(ListingDurationDto),
    ListingDurationDto,
    PartialType(CategoryIdArrayDto)
) {
}