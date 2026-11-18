import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { AgreementModality } from '../enums/agreement-modality.enum';
import { ExchangeMode } from '../enums/exchange-mode.enum';
import { Agreement } from './agreement.entity';

// Un servicio concreto: quién lo presta, quién lo recibe, qué es y cuánto dura
export interface ServiceItem {
    performerId: number;
    recipientId: number;
    description: string;
    expectedMinutes: number;
}

// Un gasto previsto: de qué es y quién lo paga
export interface ExpenseItem {
    concept: string;
    responsibleId: number;
}

// No puede haber dos versiones con el mismo número en el mismo acuerdo
@Entity()
@Unique(['agreement', 'version'])
export class AgreementVersion {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Agreement, { nullable: false, onDelete: 'CASCADE' })
    agreement!: Agreement;

    @Column({ type: 'int' })
    version!: number;

    @Column({ type: 'enum', enum: ExchangeMode })
    exchangeMode!: ExchangeMode;

    @Column({ type: 'jsonb' })
    services!: ServiceItem[];

    @Column({ type: 'enum', enum: AgreementModality })
    modality!: AgreementModality;

    // Zona aproximada o canal remoto. Nunca una dirección exacta (ADR 0004).
    @Column({ type: 'varchar', length: 350, nullable: true })
    locationOrChannel?: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    startDateTime?: Date | null;

    @Column({ type: 'jsonb', default: () => `'[]'` })
    expenses!: ExpenseItem[];

    @Column({ type: 'text' })
    cancellationTerms!: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    proposedBy!: User;

    @CreateDateColumn()
    createdAt!: Date;
}