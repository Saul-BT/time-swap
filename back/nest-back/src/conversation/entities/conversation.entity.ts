import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';

// Una persona solo puede tener UNA conversación por anuncio.
// Varias personas distintas sí pueden contactar con el mismo anuncio.
@Entity()
@Unique(['listing', 'requester'])
export class Conversation {
    @PrimaryGeneratedColumn()
    id!: number;

    // El anuncio sobre el que se habla
    @ManyToOne(() => Listing, { nullable: false, onDelete: 'CASCADE' })
    listing!: Listing;

    // La persona que pulsó «Contactar»
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    requester!: User;

    // El dueño del anuncio (el autor)
    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    owner!: User;

    @OneToMany(() => Message, (message) => message.conversation)
    messages!: Message[];

    @CreateDateColumn()
    createdAt!: Date;
}