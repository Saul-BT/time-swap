import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    // Índice para que cargar los mensajes de una conversación sea rápido
    @Index()
    @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    conversation!: Conversation;

    // Quién lo escribió (siempre sale del token, nunca de lo que envíe el cliente)
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    sender!: User;

    @Column({ type: 'text' })
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;
}