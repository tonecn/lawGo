import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AichatIndex {
    @PrimaryGeneratedColumn('uuid')
    id: string;// indexID

    @Column('uuid')
    userId: string;

    @Column({ nullable: true })
    title: string;

    @CreateDateColumn({ precision: 3 })
    createdAt: Date;

    @UpdateDateColumn({ precision: 3 })
    updatedAt: Date;

    @DeleteDateColumn({ precision: 3, nullable: true })
    deletedAt: Date;
}