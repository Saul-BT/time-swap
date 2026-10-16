import { Exchange } from 'src/exchange/entities/exchange.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique:true, nullable: false, length: 350 })
    name!: string;

    @Column({ nullable: false, length: 1000 })
    description!: string;

    @ManyToOne(() => Exchange, exchanges => exchanges.category, {
        cascade: ['insert', 'update']
    })
    exchanges!: Exchange[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date | null;
}
