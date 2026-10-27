import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ExchangeType } from '../enums/exchange-type.enum';
import { ExchangeMode } from '../enums/exchange-mode.enum';
import { Category } from 'src/category/entities/category.entity';
import { ExchangeStatus } from '../enums/exchange-status.enum';

@Entity()
export class Exchange {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type:'varchar', nullable: false, length: 350 })
    title!: string;

    @Column({ type:'varchar', nullable: false, length: 1000 })
    description!: string;

    @Column({
        type: 'enum',
        nullable: false,
        enum: ExchangeType,
    })
    type!: ExchangeType;

    @Column({
        type: 'enum',
        nullable: false,
        default: ExchangeMode.ANY,
        enum: ExchangeMode,
    })
    mode!: ExchangeMode;
    
    @ManyToOne(() => Category, category => category.exchanges)
    category!: Category;

    @Column({
        type: 'timestamptz',
    })
    startDateTime!: Date;

    @Column({ type: 'varchar', nullable: false })
    duration!: string;

    @Column({ type: 'varchar', nullable: true, length: 350 })
    location?: string | null;

    @Column({
        type: 'enum',
        enum: ExchangeStatus,
        default: ExchangeStatus.OPEN,
    })
    status!: ExchangeStatus;

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

    @DeleteDateColumn()
    deletedAt!: Date | null;

    @ManyToOne(() => User, (user) => user.exchanges)
    owner!: User;
}
