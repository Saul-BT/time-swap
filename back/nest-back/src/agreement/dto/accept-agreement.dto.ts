import { IsInt, Min } from 'class-validator';

export class AcceptAgreementDto {
    @IsInt({ message: 'version must be an integer' })
    @Min(1, { message: 'version must be at least 1' })
    version!: number;
}