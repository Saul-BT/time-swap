import { IntersectionType } from "@nestjs/swagger";
import { CategoryIdDto } from "src/category/dto/components.dto";
import { ListingDescriptionDto, ListingDurationDto, ListingExpiresAtDto, ListingKindDto, ListingLocationDto, ListingModeDto, ListingTitleDto } from "./components.dto";

export class CreateListingDTO extends IntersectionType(
    ListingTitleDto,
    ListingDescriptionDto,
    ListingKindDto,
    ListingModeDto,
    //ListingStartTimeDto, //todo decided through chat later, not at creation time
    ListingDurationDto,
    ListingLocationDto,
    ListingExpiresAtDto,
    CategoryIdDto
) {}