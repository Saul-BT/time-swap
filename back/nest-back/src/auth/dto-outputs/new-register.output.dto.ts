import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Language } from '../../user/enums/language.enum';
import { NewRegisterDto } from '../dto/new-register.dto';

export class NewRegisterOutput extends PartialType(PickType(NewRegisterDto, ['mail', 'name'] as const)) {
    @ApiProperty({ example: 'sender@hosting.com', required: false })
    senderEmail?: string;

    @ApiProperty({ example: 'BunchOfTextAndNumbers' })
    verificationToken!: string;

    @ApiProperty({ example: Language.ES })
    @IsEnum(Language)
    @IsNotEmpty()
    language!: Language;

    @ApiProperty({ example: '2022-01-01', required: false })
    acceptedAt?: Date;

    @ApiProperty({ example: '2022-01-01T00:00:00Z' })
    createdAt!: Date;

    @ApiProperty({ example: '2022-01-01T00:00:00Z' })
    updatedAt!: Date;

    @ApiProperty({ example: '2022-01-01T00:00:00Z', required: false })
    deletedAt?: Date;
}
