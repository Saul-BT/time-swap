import { PartialType } from "@nestjs/swagger";
import { CreateListingDTO } from "./create-listing.dto";

//partial type turns all inherited properties into optional
export class UpdateListingDTO extends PartialType ( CreateListingDTO ) {}