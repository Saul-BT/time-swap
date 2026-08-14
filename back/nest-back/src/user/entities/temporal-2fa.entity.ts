import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TemporalOtp {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    otp!: string;

    @Column()
    expiration!: Date;

    @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user!: User;

    @Column({ type: 'boolean', default: false })
    validated!: boolean;
}
