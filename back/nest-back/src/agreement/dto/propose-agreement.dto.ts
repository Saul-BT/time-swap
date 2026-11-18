import { IsInt, Min } from 'class-validator';
import { AgreementTermsDto } from './agreement-terms.dto';

export class ProposeAgreementDto extends AgreementTermsDto {
    @IsInt({ message: 'conversationId must be an integer' })
    @Min(1, { message: 'conversationId must be greater than 0' })
    conversationId!: number;
}