import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class ResponseWrapperDTO<T> {
    @ApiProperty({ description: 'Mensaje para front', example: 'User updated successfully' })
    @IsNotEmpty()
    @IsString()
    message!: string;

    @ApiProperty({ description: 'Objeto con los datos del servicio' })
    @ValidateNested()
    result!: T;
}
