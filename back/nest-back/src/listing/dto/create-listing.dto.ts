import { IntersectionType } from "@nestjs/swagger";
import { CategoryIdDto } from "src/category/dto/components.dto";
import { ListingDescriptionDto, ListingDurationDto, ListingKindDto, ListingLocationDto, ListingModeDto, ListingStartTimeDto, ListingTitleDto } from "./components.dto";

export class CreateListingDTO extends IntersectionType(
    ListingTitleDto,
    ListingDescriptionDto,
    ListingKindDto,
    ListingModeDto,
    //ListingStartTimeDto, //todo decided through chat later, not at creation time
    ListingDurationDto,
    ListingLocationDto,
    CategoryIdDto
) {}