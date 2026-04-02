import { Global, Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { AuthHelperService } from "../services/auth.service";
import { UserRepository } from "../repository/user.repo";

@Global()
@Module({
    providers: [SocketService, AuthHelperService, UserRepository],
    exports: [SocketService],
})
export class SocketModule { }
