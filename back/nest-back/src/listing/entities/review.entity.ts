import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Listing } from './listing.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'decimal',
        precision: 2,
        scale: 1,
    })
    score!: number;

    @Column({ type:'varchar', nullable: true, length: 1000 })
    description?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User)
    author!: User;

    @ManyToOne(() => User)
    reviewedUser!: User;

    @ManyToOne(() => Listing, listing => listing.reviews)
    listing!: Listing;
}