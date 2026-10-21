import { PartialType } from "@nestjs/swagger";
import { CreateExchangeDTO } from "./create-exchange.dto";

//partial type turns all inherited properties into optional
export class UpdateExchangeDTO extends PartialType ( CreateExchangeDTO ) {}