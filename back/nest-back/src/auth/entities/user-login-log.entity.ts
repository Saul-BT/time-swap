import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class LoginLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.logins, { onDelete: 'CASCADE' })
    user!: User;

    @Column({ default: new Date(Date.now()) })
    connectedUntil!: Date;

    @Column({ type: 'varchar', length: 46, nullable: true })
    ipAddress!: string;

    @Column({ default: true })
    wasSuccessful!: boolean;

    @CreateDateColumn()
    createdAt!: Date; // Valor para integridad de la BD

    @UpdateDateColumn()
    updatedAt!: Date; // Valor para integridad de la BD

    @DeleteDateColumn()
    deletedAt!: Date; // Valor para integridad de la BD

    @Column({ nullable: true })
    mail!: string; // Correo electrónico del usuario
}