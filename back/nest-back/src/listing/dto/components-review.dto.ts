import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class ReviewScoreDto {
    @ApiProperty({ example: 4 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    score!: number;
}

export class ReviewDescriptionDto {
    @ApiProperty({ example: '10/10 would repeat' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 1000)
    description!: string;
}