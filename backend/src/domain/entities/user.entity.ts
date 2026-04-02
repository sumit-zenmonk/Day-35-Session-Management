import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { SessionEntity } from "./session.entity";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => SessionEntity, (session) => session.user)
    sessions: SessionEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}