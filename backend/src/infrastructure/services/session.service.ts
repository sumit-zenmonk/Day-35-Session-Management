import { BadRequestException, Injectable } from "@nestjs/common";
import { SessionRepository } from "src/infrastructure/repository/session.repo";
import { Request } from "express";
import { randomUUID } from "crypto";

@Injectable()
export class SessionHelperService {
    constructor(private readonly sessionRepo: SessionRepository) { }

    async createSession(req: Request, userUuid: string) {
        const deviceId = randomUUID();
        const deviceType = req.headers['user-agent'] || 'unknown';
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];

        const expiresAt = new Date();
        const totalSessions = await this.sessionRepo.findSessionByUser(userUuid);

        if (totalSessions.length >= (Number(process.env.SESSION_LIMIT) || 2)) {
            throw new BadRequestException("Too many devices logged in");
        }

        expiresAt.setHours(expiresAt.getHours() + (Number(process.env.SESSION_EXPIRE_HOUR) || 1));
        await this.sessionRepo.createSession({
            deviceId,
            deviceType,
            userUuid,
            ip,
            userAgent,
            expiresAt,
        });

        return deviceId;
    }
}