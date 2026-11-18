import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
    // Quitamos espacios de los extremos para que "   " cuente como vacío
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({ message: 'content must be a string' })
    @IsNotEmpty({ message: 'content must not be empty' })
    @MaxLength(2000, { message: 'content must be at most 2000 characters' })
    content!: string;
}