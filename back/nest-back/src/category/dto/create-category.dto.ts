import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDTO {
    @ApiProperty({ example: 'Category 1' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 350)
    readonly name!: string;

    @ApiProperty({ example: 'Category 1 is a category that etc...' })
    @IsNotEmpty({
        message: 'IS EMPTY'
    })
    @IsString()
    @Length(1, 1000)
    readonly description!: string;
}
