import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Clase privada para declarar datos de ejemplo. NO EXPORTAR.
 */
export class UnverifiedOutDTO {
    @ApiProperty({ example: 'correo1@hosting.com' })
    @IsEmail()
    @IsNotEmpty()
    mail!: string;

    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvcnJlbzFAaG9zdGluZy5jb20iLCJyb2xlIjoiZnJlZSIsImlhdCI6MTcyODA3NzcxMywiZXhwIjoxNzI4MDc3ODMzfQ.Dh2Erof1boThJcO3fh_Prh4AJf4TftYWoYsw_Dm65Yo',
    })
    @IsString()
    @IsNotEmpty()
    verification_token!: string;

    @IsDate()
    @IsNotEmpty()
    createdAt!: Date;
}

export class UnverifiedListOutDto {
    @ApiProperty({
        type: [UnverifiedOutDTO],
        example: [
            {
                mail: 'correo1@hosting.com',
                verification_token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvcnJlbzFAaG9zdGluZy5jb20iLCJyb2xlIjoiZnJlZSIsImlhdCI6MTcyODA3NzcxMywiZXhwIjoxNzI4MDc3ODMzfQ.Dh2Erof1boThJcO3fh_Prh4AJf4TftYWoYsw_Dm65Yo',
            },
            {
                mail: 'correo2@hosting.com',
                verification_token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvcnJlbzJAaG9zdGluZy5jb20iLCJyb2xlIjoiZnJlZSIsImlhdCI6MTcyODA3NzcxMywiZXhwIjoxNzI4MDc3ODMzfQ.Dh2Erof1boThJcO3fh_Prh4AJf4TftYWoYsw_Dm65Yo',
            },
        ],
    })
    user!: UnverifiedOutDTO[];
}
