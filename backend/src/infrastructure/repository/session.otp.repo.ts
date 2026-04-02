import { Injectable } from "@nestjs/common";
import { SessionOtpEntity } from "src/domain/entities/session.otp.entity";
import { DataSource, MoreThan, Repository } from "typeorm";

@Injectable()
export class SessionOtpRepository extends Repository<SessionOtpEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(SessionOtpEntity, dataSource.createEntityManager());
    }

    async createSessionOtp(data: Partial<SessionOtpEntity>) {
        const session = this.create(data);
        return await this.save(session);
    }

    async findOtpByEmail(email: string) {
        const user = await this.find({
            where: {
                email,
                expiresAt: MoreThan(new Date()),
            }
        });
        return user;
    }
}