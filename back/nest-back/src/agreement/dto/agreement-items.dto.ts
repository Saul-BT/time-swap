import { IsInt, IsNotEmpty, IsString, MaxLength, Min, Max } from 'class-validator';

export class ServiceItemDto {
    @IsInt({ message: 'performerId must be an integer' })
    @Min(1, { message: 'performerId must be greater than 0' })
    performerId!: number;

    @IsInt({ message: 'recipientId must be an integer' })
    @Min(1, { message: 'recipientId must be greater than 0' })
    recipientId!: number;

    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description must not be empty' })
    @MaxLength(500, { message: 'description must be at most 500 characters' })
    description!: string;

    // Tope de seguridad de un día, para evitar errores de teclado. Se puede cambiar.
    @IsInt({ message: 'expectedMinutes must be an integer' })
    @Min(1, { message: 'expectedMinutes must be at least 1' })
    @Max(1440, { message: 'expectedMinutes must be at most 1440' })
    expectedMinutes!: number;
}

export class ExpenseItemDto {
    @IsString({ message: 'concept must be a string' })
    @IsNotEmpty({ message: 'concept must not be empty' })
    @MaxLength(200, { message: 'concept must be at most 200 characters' })
    concept!: string;

    @IsInt({ message: 'responsibleId must be an integer' })
    @Min(1, { message: 'responsibleId must be greater than 0' })
    responsibleId!: number;
}