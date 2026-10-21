import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, Length, Min } from "class-validator";

export class CategoryIdDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1) //always starts at 1
    readonly categoryId!: number;
}

export class CategoryIdArrayDto {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => Number)
    @IsInt({ each: true })
    @Min(1, { each: true })
    readonly categoryIds!: number[];
}

export class CategoryNameDto {
    @ApiProperty({ example: 'Category 1' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 350)
    readonly categoryName!: string;
}

export class CategoryDescriptionDto {
    @ApiProperty({ example: 'Category 1 is a category that etc...' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 1000)
    readonly categoryDescription!: string;
}