import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class RenewListingDTO {
    @ApiProperty({ example: '2030-01-01T00:00:00.000Z' })
    @IsNotEmpty()
    @IsDateString()
    expiresAt!: string;
}