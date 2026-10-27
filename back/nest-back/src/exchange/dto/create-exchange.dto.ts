import { IntersectionType } from "@nestjs/swagger";
import { ExchangeDurationDto, ExchangeLocationDto, ExchangeModeDto, ExchangeStartTimeDto, ExchangeTitleDto, ExchangeTypeDto, ExchangeDescriptionDto } from "./components.dto";
import { CategoryIdDto } from "src/category/dto/components.dto";

export class CreateExchangeDTO extends IntersectionType(
    ExchangeTitleDto,
    ExchangeDescriptionDto,
    ExchangeTypeDto,
    ExchangeModeDto,
    ExchangeStartTimeDto,
    ExchangeDurationDto,
    ExchangeLocationDto,
    CategoryIdDto
) {}