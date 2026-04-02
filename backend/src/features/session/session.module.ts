import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { SessionRepository } from "src/infrastructure/repository/session.repo";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";
import { SessionOtpRepository } from "src/infrastructure/repository/session.otp.repo";
import { SessionHelperService } from "src/infrastructure/services/session.service";
import { AuthHelperService } from "src/infrastructure/services/auth.service";
import { SocketService } from "src/infrastructure/socket/socket.service";

@Module({
    imports: [],
    controllers: [SessionController],
    providers: [UserRepository, SessionRepository, SessionOtpRepository, SessionService, SessionHelperService, AuthHelperService, SocketService],
    exports: [SessionModule],
})

export class SessionModule { }