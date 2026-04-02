import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { AuthHelperService } from "src/infrastructure/services/auth.service";
import { BcryptService } from "src/infrastructure/services/bcrypt.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { SessionHelperService } from "src/infrastructure/services/session.service";
import { SessionRepository } from "src/infrastructure/repository/session.repo";
import type { Request } from "express";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly authHelper: AuthHelperService,
        private readonly bcryptService: BcryptService,
        private readonly sessionHelperService: SessionHelperService,
        private readonly sessionRepo: SessionRepository,
    ) { }

    async registerUser(body: RegisterDto, req: Request) {
        const existingUser = await this.userRepo.findByEmail(body.email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        body.password = await this.bcryptService.hashPassword(body.password);
        const user = await this.userRepo.register(body);
        const token = await this.authHelper.generateJwtToken(user);
        const deviceId = await this.sessionHelperService.createSession(req, user.uuid);

        return {
            message: "Registered User",
            access_token: token,
            deviceId,
            user: {
                name: user.name,
                email: user.email,
                uid: user.uuid,
            }
        };
    }

    async loginUser(body: LoginDto, req: Request) {
        const users = await this.userRepo.findByEmail(body.email);
        if (!users) {
            throw new BadRequestException('Invalid credentials');
        }

        const user = users;
        const isValid = await this.bcryptService.verifyPassword(
            body.password,
            user.password
        );
        if (!isValid) {
            throw new BadRequestException('Invalid credentials');
        }

        const token = await this.authHelper.generateJwtToken(user);
        const deviceId = await this.sessionHelperService.createSession(req, user.uuid);

        return {
            message: "Logged In User",
            access_token: token,
            deviceId,
            user: {
                name: user.name,
                email: user.email,
                uid: user.uuid,
            }
        };
    }

    async logout(deviceId: string) {
        if (!deviceId) {
            throw new BadRequestException('deviceId required');
        }
        await this.sessionRepo.deleteSessionByDeviceId(deviceId);
        return {
            message: "Logged out successfully"
        };
    }
}