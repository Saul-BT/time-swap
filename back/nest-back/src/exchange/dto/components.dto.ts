import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { ExchangeMode } from "src/category/enums/exchange-mode.enum";
import { ExchangeType } from "src/category/enums/exchange-type.enum";
import { ExchangeStatus } from "../enums/exchange-status.enum";

export class ExchangeTitleDto {
    @ApiProperty({ example: 'Exchange 1' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 350)
    title!: string;
}

export class ExchangeDescriptionDto {
    @ApiProperty({ example: 'Exchange consists of A and B etc...' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 1000)
    description!: string;
}

export class ExchangeTypeDto {
    @ApiProperty({ example: ExchangeType.OFFER })
    @IsEnum(ExchangeType)
    @IsNotEmpty()
    type!: ExchangeType;
}

export class ExchangeModeDto {
    @ApiProperty({ example: ExchangeMode.ANY })
    @IsEnum(ExchangeMode)
    @IsNotEmpty()
    mode!: ExchangeMode;
}

export class ExchangeStartTimeDto {
    @IsNotEmpty()
    @IsDateString()
    startTime!: string;
}

export class ExchangeStatusDto {
    @IsOptional()
    @ApiProperty({ example: ExchangeStatus.OPEN })
    @IsEnum(ExchangeStatus)
    @IsNotEmpty()
    status?: ExchangeStatus;
}

export class ExchangeLowerStartTimeDto {
    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    lowerStartTime?: string;
}

export class ExchangeHigherStartTimeDto {
    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    higherStartTime?: string;
}

export class ExchangeDurationDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(15)
    @Max(480)
    durationMinutes!: number;
}

export class ExchangeLowerDurationDto {
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(15)
    @Max(480)
    lowerDurationMinutes?: number;
}

export class ExchangeHigherDurationDto {
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(15)
    @Max(480)
    higherDurationMinutes?: number;
}

export class ExchangeLocationDto {
    @ApiProperty({ example: 'Madrid 42' })
    @IsOptional()
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 350)
    location?: string;
}
