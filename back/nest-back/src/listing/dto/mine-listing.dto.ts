import { IntersectionType } from "@nestjs/swagger";
import { PaginationDto } from "../../common/dtos/pagination.dto";
import { ListingStatusDto } from "./components.dto";

export class MineListingDTO extends IntersectionType(PaginationDto, ListingStatusDto) {}