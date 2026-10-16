import { User } from 'src/user/entities/user.entity';
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
export class CategoryRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique:true, nullable: false, length: 350 })
    name!: string;

    @Column({ nullable: false, length: 1000 })
    description!: string;

    @JoinTable({name: "user-category-requests"})
    @ManyToMany(() => User, voters => voters.requests)
    voters!: User[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date | null;
}
