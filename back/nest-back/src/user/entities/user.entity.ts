import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { UserCompany } from '../../company/entities/user-company.entity';
import { Language } from '../enums/language.enum';
import { TemporalOtp } from './temporal-2fa.entity';
import { LoginLog } from 'src/auth/entities/user-login-log.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    mail!: string;

    @Column({ type: 'text', nullable: true })
    name!: string | null;

    @Column({ type: 'text', nullable: true, select: false })
    password!: string | null;

    @Column({ type: 'enum', nullable: false, default: Role.USER, enum: Role })
    role!: Role;

    @Column({
        type: 'enum',
        nullable: false,
        default: Language.EN,
        enum: Language,
    })
    language!: Language;

    @Column({
        type: 'bigint',
        default: 0,
        nullable: false,
    })
    points!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date | null;

    //@Column({ type: 'varchar', nullable: true, length: 255 })
    //avatarFileName?: string;

    /**
     * Este valor se usa para saber si el usuario tiene activo un segundo
     * factor de autenticación o no
     */
    @Column({ type: 'boolean', default: false })
    twoFactorCode!: boolean;

    /**
     * Relación con la columna que almacena los OneTimePassword que se gestionan
     * junto a los 2FA
     */
    @OneToMany(() => TemporalOtp, (otp) => otp.user, { cascade: ['insert', 'update', 'remove'] })
    otps!: TemporalOtp[];

    @OneToMany(() => UserCompany, (userCompany) => userCompany.user, { cascade: ['insert', 'update', 'remove'] })
    userCompanies!: UserCompany[];

    
    @Column({ type: 'varchar', nullable: true, default: null })
    theme!: string | null;

    @Column({ type: 'timestamp', nullable: true })
    lastLogIn!: Date;

    @OneToMany(() => LoginLog, (log) => log.user)
    logins!: LoginLog[];
}

export { Role };
