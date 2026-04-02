import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";

@Entity("sessions_otp")
export class SessionOtpEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "int" })
    otp: number;

    @Column()
    email: string;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}