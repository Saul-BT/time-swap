import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserCompany } from './user-company.entity';

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Se recomienda controlar la longitud del nombre de la empresa para evitar
     * problemas en la base de datos, estudiar si aumentar el límite en caso de
     * ser necesario.
     */
    @Column({ unique: true, nullable: false, length: 350 })
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date | null;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    logoFileName?: string;

    /**
     * La tabla de user_company es una relación de muchos a muchos entre los
     * usuarios y las compañías, dando igual la lógica que se quiera seguir a
     * la hora de administrar compañías (que un usuario tenga una o varias
     * empresas) se recomienda mantener esta relación para poder añadir datos
     * clave a la relación. Por ejemplo, un rol de empresa separado del rol de
     * la plataforma. En la lógica del servicio se podrá poner protección
     * contra multi cuentas en caso de ser necesario.
     */
    @OneToMany(() => UserCompany, (userCompany) => userCompany.company, {
        cascade: ['insert', 'update', 'remove'],
    })
    userCompanies!: UserCompany[];
}
