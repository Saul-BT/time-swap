import { Listing } from 'src/listing/entities/listing.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
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

    @OneToMany(() => Listing, listings => listings.category, {
        cascade: ['insert', 'update']
    })
    listings!: Listing[];

    @ManyToMany(() => User, user => (user.skills), { cascade: ['insert', 'update']})
    @JoinTable({ name: 'user_skills' })
    teachers!: User[];

    @ManyToMany(() => User, user => (user.interests), { cascade: ['insert', 'update']})
    @JoinTable({ name: 'user_interests' })
    students!: User[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
