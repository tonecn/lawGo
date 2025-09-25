import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AiChatHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    indexID: string;

    @Column({ enum: ['user', 'assistant', 'system'] })
    role: 'user' | 'assistant' | 'system';

    @Column({ default: false })
    isHidden: boolean;// to user

    @Column()
    content: string;

    @CreateDateColumn({ precision: 3 })
    createdAt: Date;
}