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

@Entity()
export class Exchange {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, length: 350 })
    title!: string;

    @Column({ nullable: false, length: 1000 })
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
    
    @OneToMany(() => Category, category => category.exchanges)
    category!: Category;

    @Column({
        type: 'timestamptz',
    })
    startDateTime!: Date;

    @Column({ type: 'smallint', nullable: false })
    durationMinutes!: number;

    @Column({ nullable: true, length: 350 })
    location?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date | null;

    @ManyToOne(() => User, (user) => user.exchanges)
    owner!: User;
}
