import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ListingKind } from '../enums/listing-kind.enum';
import { ListingMode } from '../enums/listing-mode.enum';
import { ListingStatus } from '../enums/listing-status.enum';
import { Category } from 'src/category/entities/category.entity';

@Entity()
export class Listing {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type:'varchar', nullable: false, length: 350 }) //todo match length with dto
    title!: string;

    @Column({ type:'varchar', nullable: false, length: 1000 })
    description!: string;

    @Column({
        type: 'enum',
        nullable: false,
        enum: ListingKind,
    })
    kind!: ListingKind;

    @Column({
        type: 'enum',
        nullable: false,
        default: ListingMode.BOTH,
        enum: ListingMode,
    })
    mode!: ListingMode;
    
    /**
     * Entidad gestionada aparte según MOD-05
     */
    @ManyToOne(() => Category, category => category.listings)
    category!: Category;

    @Column({
        type: 'timestamptz',
        nullable: true
    })
    startDateTime?: Date;

    /** Texto libre, como en el formulario del front (por ejemplo "1 h + material"). */
    @Column({ type: 'varchar', nullable: false })
    duration!: string;

    /** Zona aproximada, nunca una dirección exacta (ADR 0004). Obligatoria si no es remoto. */
    @Column({ type: 'varchar', nullable: true, length: 350 })
    location?: string;

    @Column({
        type: 'enum',
        enum: ListingStatus,
        default: ListingStatus.ACTIVE,
    })
    status!: ListingStatus;

    @Column({
        nullable: true,
        type: 'timestamptz',
    })
    completedTime?: Date | null;

    @Column({
        nullable: true,
        type: 'timestamptz',
    })
    cancelledTime?: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.listings)
    author!: User;
}