import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { SessionRepository } from "src/infrastructure/repository/session.repo";
import { UserEntity } from "src/domain/entities/user.entity";
import { generateOTP } from "src/infrastructure/utils/otp.generator";
import { SessionOtpRepository } from "src/infrastructure/repository/session.otp.repo";
import { CreateSessionDto } from "./dto/create.session.dto";
import { AuthHelperService } from "src/infrastructure/services/auth.service";
import { BcryptService } from "src/infrastructure/services/bcrypt.service";
import { SessionHelperService } from "src/infrastructure/services/session.service";
import type { Request } from "express";
import { SocketService } from "src/infrastructure/socket/socket.service";

@Injectable()
export class SessionService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly sessionRepo: SessionRepository,
        private readonly sessionOtpRepo: SessionOtpRepository,
        private readonly sessionHelperService: SessionHelperService,
        private readonly authHelper: AuthHelperService,
        private readonly socketService: SocketService,
    ) { }

    async getSessions(user: UserEntity) {
        return await this.sessionRepo.findSessionByUser(user.uuid);
    }

    async makeSessionRequestOtp(email: string) {
        const isUserExists = await this.userRepo.findByEmail(email);
        if (!isUserExists) {
            throw new BadRequestException("User Not exists with this email");
        }

        const isOtpAlreadyExists = await this.sessionOtpRepo.findOtpByEmail(email);
        if (isOtpAlreadyExists.length) {
            throw new BadRequestException("Otp Already Active");
        }

        const otp = Number(generateOTP());
        const seconds = Number(process.env.SESSION_OTP_EXPIRE_SECONDS) || 60;
        const expiresAt = new Date(Date.now() + seconds * 1000);

        const otpRecord = await this.sessionOtpRepo.createSessionOtp({ email, otp, expiresAt });

        this.socketService.emitToUser(isUserExists.uuid, 'newOtp', otpRecord);
        return {
            expiresAt,
            message: "Otp Generated Success"
        }
    }

    async getRequestedOtp(user: UserEntity) {
        const isOtpAlreadyExists = await this.sessionOtpRepo.findOtpByEmail(user.email);
        return {
            data: isOtpAlreadyExists,
            message: "Otp fetched Success"
        }
    }

    async createSessionUsingOtp(body: CreateSessionDto, req: Request) {
        const { email, otp } = body;

        const isUserExists = await this.userRepo.findByEmail(email);
        if (!isUserExists) {
            throw new BadRequestException("User Not exists with this email");
        }

        const otpRecord = await this.sessionOtpRepo.findOtpByEmail(email);
        if (!otpRecord || otpRecord.length === 0) {
            throw new BadRequestException("OTP not requested or expired.");
        }

        const validOtpRecord = otpRecord.find((otpEntry) => otpEntry.otp === otp);
        if (!validOtpRecord) {
            throw new BadRequestException("Invalid OTP.");
        }

        const currentDate = new Date();
        if (validOtpRecord.expiresAt < currentDate) {
            throw new BadRequestException("OTP expired.");
        }

        await this.sessionOtpRepo.softDelete({ email });

        const userSessions = await this.sessionRepo.findSessionByUser(isUserExists.uuid);
        if (userSessions.length >= (Number(process.env.SESSION_LIMIT) || 2)) {
            const oldestSession = userSessions.reduce((prev, current) =>
                (prev.expiresAt < current.expiresAt) ? prev : current
            );
            await this.sessionRepo.deleteSessionByDeviceId(oldestSession.deviceId);
        }

        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new BadRequestException("User not found.");
        }

        const token = await this.authHelper.generateJwtToken(user);
        const deviceId = await this.sessionHelperService.createSession(req, user.uuid);

        return {
            message: "Session created successfully",
            access_token: token,
            deviceId,
            user: {
                name: user.name,
                email: user.email,
                uid: user.uuid,
            }
        };
    }
}