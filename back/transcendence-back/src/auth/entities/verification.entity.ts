import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Language } from '../../user/enums/language.enum';

@Entity()
export class Verification {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    senderEmail!: string; // Valor por si se quiere desarrollar un sistema de invitaciones

    /**
     * Este valor será el del correo electrónico del usuario que luego verificaremos o rechazaremos. El valor
     * no es único por que cabe la posibilidad de que un usuario tenga varias invitaciones. Por defecto esto
     * está controlado en el servicio y no existe esa posibilidad, pero se puede cambiar en caso de que sea
     * necesario alterando el servicio.
     */
    @Column()
    targetEmail!: string;

    @Column()
    verificationToken!: string;

    @Column({ nullable: true })
    name!: string;

    @Column({ nullable: true })
    password!: string;

    @Column({
        type: 'enum',
        nullable: false,
        default: Language.EN,
        enum: Language,
    })
    language!: Language;

    @Column({ type: 'date', nullable: true })
    acceptedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date; // Valor para integridad de la BD

    @UpdateDateColumn()
    updatedAt!: Date; // Valor para integridad de la BD

    @DeleteDateColumn()
    deletedAt!: Date; // Valor para integridad de la BD
}
