import { ApiProperty } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AddToCompanyConflicts {
    @ApiProperty({ example: 409 })
    statusCode!: number;

    @ApiProperty({
        example: [
            'Company not exists.',
            'You must be a company administrator.',
            'The user you are trying to invite is already in the company.',
        ],
    })
    messages!: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class DeleteCompanyConflicts {
    @ApiProperty({ example: 409 })
    statusCode!: number;

    @ApiProperty({
        example: ['Company not exist.', 'You must be a company owner.'],
    })
    messages!: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class RemoveUserToCompanyConflicts {
    @ApiProperty({ example: 409 })
    statusCode!: number;

    @ApiProperty({
        example: [
            'Company not exist.',
            'You must be a company administrator.',
            'User not found.',
            'The user is not in the company.',
            'The user is the owner of the company.',
        ],
    })
    messages!: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class LeaveCompanyConflict {
    @ApiProperty({ example: 409 })
    statusCode!: number;

    @ApiProperty({
        example: ['Company not exist.', 'The user is not in the company.', 'The user is the owner of the company.'],
    })
    messages!: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class DelegateCompanyConflict {
    @ApiProperty({ example: 409 })
    statusCode!: number;

    @ApiProperty({
        example: ['Company not exist.', 'The user is not in the company.', 'User not found.'],
    })
    messages!: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class UpdateCompanyConflics {
    @ApiProperty({ example: 409 })
    statusCode!: number;

    @ApiProperty({
        example: [
            'Company not exist.',
            'You must be a company admin.',
            'Company already exists.',
            'You must be a company owner.',
        ],
    })
    messages!: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CRUDcompanyLogoConflics {
    @ApiProperty({ example: 409 })
    statusCode!: number;

    @ApiProperty({
        example: ['Company not exist.', 'You must be a company admin.'],
    })
    messages!: string[];
}
