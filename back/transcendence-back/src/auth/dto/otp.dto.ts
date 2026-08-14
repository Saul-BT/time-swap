import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OtpDto {
    @ApiProperty({ example: '123456' })
    @IsString()
    readonly code!: string;
}
