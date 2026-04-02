import { Injectable } from "@nestjs/common";
import { DataSource, MoreThan, Repository } from "typeorm";
import { SessionEntity } from "src/domain/entities/session.entity";

@Injectable()
export class SessionRepository extends Repository<SessionEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(SessionEntity, dataSource.createEntityManager());
    }

    async createSession(data: Partial<SessionEntity>) {
        const session = this.create(data);
        return await this.save(session);
    }

    async deleteSessionByDeviceId(deviceId: string) {
        return await this.softDelete({ deviceId });
    }

    async deleteAllUserSessions(userUuid: string) {
        return await this.softDelete({ userUuid });
    }

    async findSessionByDeviceId(deviceId: string) {
        return await this.findOne({
            where: { deviceId, expiresAt: MoreThan(new Date()) }
        });
    }

    async findSessionByUser(user_uuid: string) {
        return await this.find({
            where: {
                userUuid: user_uuid,
                expiresAt: MoreThan(new Date()),
            },
            relations: {
                user: true,
            },
            select: {
                uuid: true,
                deviceId: true,
                deviceType: true,
                ip: true,
                expiresAt: true,
                created_at: true,
                user: {
                    uuid: true,
                    name: true,
                    email: true
                },
            },
        });

    }
}