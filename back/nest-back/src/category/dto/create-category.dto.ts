import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CategoryDescriptionDto, CategoryNameDto } from './components.dto';

export class CreateCategoryDTO extends IntersectionType(
    CategoryNameDto,
    CategoryDescriptionDto
) {}
