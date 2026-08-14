import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Status } from '../enums/status.enum';

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'enum',
        nullable: false,
        default: Status.CONNECTED,
        enum: Status,
    })
    status!: Status;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
