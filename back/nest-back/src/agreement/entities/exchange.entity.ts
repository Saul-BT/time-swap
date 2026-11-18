import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ExchangeStatus } from '../enums/exchange-status.enum';
import { Agreement } from './agreement.entity';

@Entity()
export class Exchange {
    @PrimaryGeneratedColumn()
    id!: number;

    // Un acuerdo da lugar a un solo intercambio
    @OneToOne(() => Agreement, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn()
    agreement!: Agreement;

    @Column({ type: 'enum', enum: ExchangeStatus, default: ExchangeStatus.ACTIVE })
    status!: ExchangeStatus;

    @CreateDateColumn()
    startedAt!: Date;

    @Column({ type: 'timestamptz', nullable: true })
    completedAt?: Date | null;
}