import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from '../../conversation/entities/conversation.entity';
import { Listing } from '../../listing/entities/listing.entity';
import { User } from '../../user/entities/user.entity';
import { AgreementStatus } from '../enums/agreement-status.enum';

// Solo puede haber UN acuerdo abierto (propuesto, aceptado o activo) por conversación.
// Los cancelados no cuentan, así que se puede volver a proponer.
@Entity()
@Index(['conversation'], {
    unique: true,
    where: `"status" IN ('proposed', 'accepted', 'active')`,
})
export class Agreement {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Conversation, { nullable: false, onDelete: 'CASCADE' })
    conversation!: Conversation;

    @ManyToOne(() => Listing, { nullable: false, onDelete: 'CASCADE' })
    listing!: Listing;

    // Quien presta el servicio del anuncio
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    provider!: User;

    // Quien lo recibe
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    receiver!: User;

    @Column({ type: 'enum', enum: AgreementStatus, default: AgreementStatus.PROPOSED })
    status!: AgreementStatus;

    // Número de la versión vigente (1, 2, 3...)
    @Column({ type: 'int', default: 1 })
    currentVersion!: number;

    @CreateDateColumn()
    createdAt!: Date;
}