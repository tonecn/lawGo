import { UserRole } from "src/common/enums/user-role.enum";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 20 })
    username: string;

    @Column('varchar', { length: 11, unique: true })
    phone: string;

    @Column('char', { length: 32, nullable: true })
    salt: string;

    @Column('char', { length: 64, nullable: true })
    passwordHash: string;

    @CreateDateColumn({ precision: 3 })
    createdAt: Date;

    @UpdateDateColumn({ precision: 3 })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, precision: 3 })
    deletedAt: Date;

    @Column('simple-array', { default: '' })
    roles: UserRole[];

    @BeforeInsert()
    setDefaultUsername() {
        if (!this.username || this.username.trim() === '') {
            this.username = this.phone.split('').map((v, i) => i >= 7 ? '*' : v).join('');
        }
    }

    hasRole(role: UserRole) {
        return this.roles && this.roles.includes(role);
    }

    addRole(role: UserRole) {
        if (!this.roles) {
            this.roles = []
        }
        if (!this.roles.includes(role)) {
            this.roles.push(role);
        }
    }

    removeRole(role: UserRole) {
        if (this.roles) {
            this.roles = this.roles.filter(r => r !== role);
        }
    }
}