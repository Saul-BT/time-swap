import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ThrotterGuardErrorDto {
    @IsNumber()
    @ApiProperty({ example: 429 })
    statusCode!: number;

    @ApiProperty({ example: 'ThrottlerException: Too Many Requests' })
    @IsString()
    @IsNotEmpty({
        message: 'ThrottlerException: Too Many Requests',
    })
    message!: string;
}
