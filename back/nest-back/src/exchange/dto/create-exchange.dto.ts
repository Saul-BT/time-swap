import { IntersectionType } from "@nestjs/swagger";
import { ExchangeDescriptionDto, ExchangeDurationDto, ExchangeLocationDto, ExchangeModeDto, ExchangeStartTimeDto, ExchangeTitleDto, ExchangeTypeDto } from "./components.dto";
import { CategoryIdDto } from "src/category/dto/components.dto";

export class CreateExchangeDTO extends IntersectionType(
    ExchangeTitleDto,
    ExchangeDescriptionDto,
    ExchangeTypeDto,
    ExchangeModeDto,
    CategoryIdDto,
    ExchangeStartTimeDto,
    ExchangeDurationDto,
    ExchangeLocationDto
) {}