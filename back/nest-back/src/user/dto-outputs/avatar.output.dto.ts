import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AvatarOutputDTO {
    @ApiProperty({ example: 'avatar.png' })
    @IsNotEmpty()
    file_name!: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    status!: boolean;
}
