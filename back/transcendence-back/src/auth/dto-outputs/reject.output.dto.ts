import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RejectOutputDto {
    @ApiProperty({ example: 'correo@hosting.com' })
    @IsEmail()
    @IsNotEmpty()
    mail!: string;

    @ApiProperty({ example: 'Pepe' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvcnJlb0Bob3N0aW5nLmNvbSIsInJvbGUiOiJmcmVlIiwiaWF0IjoxNzI4MDc3NzEzLCJleHAiOjE3MjgwNzc4MzN9.Dh2Erof1boThJcO3fh_Prh4AJf4TftYWoYsw_Dm65Yo',
    })
    @IsString()
    @IsNotEmpty()
    verification_token!: string;

    @ApiProperty({ example: 'true' })
    @IsBoolean()
    @IsNotEmpty()
    status!: boolean;
}
