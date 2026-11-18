import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator";
import { ListingKind } from "../enums/listing-kind.enum";
import { ListingMode } from "../enums/listing-mode.enum";
import { ListingStatus } from "../enums/listing-status.enum";
import { Type } from "class-transformer";

export class ListingIdDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1) //always starts at 1
    readonly listingId!: number;
}

export class ListingTitleDto {
    @ApiProperty({ example: 'Listing 1' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 350) //todo match length with database limits
    title!: string;
}

export class ListingDescriptionDto {
    @ApiProperty({ example: 'Listing consists of A and B etc...' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 1000) //todo match length with database limits
    description!: string;
}

export class ListingKindDto {
    @ApiProperty({ example: ListingKind.OFFER })
    @IsEnum(ListingKind)
    @IsNotEmpty()
    kind!: ListingKind;
}

export class ListingModeDto {
    @ApiProperty({ example: ListingMode.BOTH })
    @IsEnum(ListingMode)
    @IsNotEmpty()
    mode!: ListingMode;
}

export class ListingStartTimeDto {
    @ApiProperty({ example: '2030-01-01' })
    @IsNotEmpty()
    @IsDateString()
    startTime!: string;
}

export class ListingStatusDto {
    @IsOptional()
    @ApiProperty({ example: ListingStatus.ACTIVE })
    @IsEnum(ListingStatus)
    @IsNotEmpty()
    status?: ListingStatus;
}

export class ListingLowerStartTimeDto {
    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    lowerStartTime?: string;
}

export class ListingHigherStartTimeDto {
    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    higherStartTime?: string;
}

export class ListingDurationDto {
    @ApiProperty({ example: '1 h' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(2, 350)
    duration!: string;
}

export class ListingLocationDto {
    @ApiProperty({ example: 'Madrid 42' })
    @IsOptional()
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 350)
    location?: string;
}
