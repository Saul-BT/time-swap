import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateListingDTO } from "./create-listing.dto";

// PartialType vuelve opcionales todos los campos; OmitType quita "kind" (el tipo no cambia tras publicar)
export class UpdateListingDTO extends OmitType(PartialType(CreateListingDTO), ['kind'] as const) {}