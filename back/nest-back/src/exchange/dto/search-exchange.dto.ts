//todo for values with ranges (like duration and start time) allow for a range search with min and max

import { IntersectionType, PartialType } from "@nestjs/swagger";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { ExchangeHigherStartTimeDto, ExchangeLocationDto, ExchangeLowerStartTimeDto, ExchangeModeDto, ExchangeStatusDto, ExchangeTitleDto, ExchangeTypeDto, ExchangeDurationDto, ExchangeDescriptionDto } from "./components.dto";
import { CategoryIdArrayDto } from "src/category/dto/components.dto";

export class SearchExchangeDTO extends IntersectionType(
    PaginationDto,
    PartialType(ExchangeTitleDto),
    PartialType(ExchangeDescriptionDto),
    PartialType(ExchangeTypeDto),
    PartialType(ExchangeModeDto),
    ExchangeStatusDto,
    ExchangeLowerStartTimeDto,
    ExchangeHigherStartTimeDto,
    PartialType(ExchangeDurationDto),
    ExchangeLocationDto,
    PartialType(CategoryIdArrayDto)
) {
}