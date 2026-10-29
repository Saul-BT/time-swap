import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ListingKind } from '../enums/listing-kind.enum';
import { ListingMode } from '../enums/listing-mode.enum';
import { ListingStatus } from '../enums/listing-status.enum';

@Entity()
export class Listing {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: ListingKind })
    kind!: ListingKind;

    @Column({ type: 'varchar', length: 120 })
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    /**
     * Texto libre a propósito: la lista de categorías aún se está decidiendo
     * con la comunidad y MOD-05 prevé gestionarla, así que no se fija en un enum.
     */
    @Column({ type: 'varchar', length: 50 })
    category!: string;

    @Column({ type: 'enum', enum: ListingMode })
    mode!: ListingMode;

    /** Zona aproximada, nunca una dirección exacta (ADR 0004). Obligatoria si no es remoto. */
    @Column({ type: 'varchar', length: 120, nullable: true })
    area!: string | null;

    /** Texto libre, como en el formulario del front (por ejemplo "1 h + material"). */
    @Column({ type: 'varchar', length: 50 })
    hours!: string;

    @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
    status!: ListingStatus;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    author!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}