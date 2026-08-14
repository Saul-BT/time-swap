import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CompanyRole } from '../enums/company-role.enum';
import { Company } from './company.entity';

@Entity()
@Unique(['user', 'company'])
export class UserCompany {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.userCompanies, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user!: User;

    @ManyToOne(() => Company, (company) => company.userCompanies, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    company!: Company;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({
        type: 'enum',
        nullable: false,
        default: CompanyRole.ADMIN,
        enum: CompanyRole,
    })
    companyRole!: CompanyRole;
}
