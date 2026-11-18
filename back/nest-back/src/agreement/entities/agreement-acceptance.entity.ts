import {
    CreateDateColumn,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Agreement } from './agreement.entity';

@Entity()
@Unique(['agreement', 'version', 'user'])
export class AgreementAcceptance {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Agreement, { nullable: false, onDelete: 'CASCADE' })
    agreement!: Agreement;

    // Qué versión se ha aceptado
    @Column({ type: 'int' })
    version!: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    user!: User;

    @CreateDateColumn()
    acceptedAt!: Date;
}