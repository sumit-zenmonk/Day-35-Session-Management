import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("sessions")
export class SessionEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    deviceId: string;

    @Column({ nullable: true })
    deviceType: string;

    @ManyToOne(() => UserEntity, (user) => user.sessions, { nullable: true, onDelete: "SET NULL", })
    @JoinColumn({ name: "userUuid" })
    user: UserEntity;

    @Column({ type: "uuid", nullable: true })
    userUuid: string;

    @Column({ nullable: true })
    ip: string;

    @Column({ nullable: true })
    userAgent: string;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}