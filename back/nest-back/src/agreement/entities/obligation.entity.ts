import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ObligationStatus } from '../enums/obligation-status.enum';
import { Exchange } from './exchange.entity';

@Entity()
export class Obligation {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Exchange, { nullable: false, onDelete: 'CASCADE' })
    exchange!: Exchange;

    // Quien debe hacer la prestación
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    performer!: User;

    // Quien la recibe
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    recipient!: User;

    @Column({ type: 'text' })
    description!: string;

    @Column({ type: 'int' })
    expectedMinutes!: number;

    @Column({ type: 'enum', enum: ObligationStatus, default: ObligationStatus.PENDING })
    status!: ObligationStatus;

    @Column({ type: 'timestamptz', nullable: true })
    markedCompletedAt?: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    confirmedAt?: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    rejectedAt?: Date | null;
}