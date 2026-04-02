import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import type { Request } from "express";

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    async registerUser(@Body() body: RegisterDto, @Req() req: Request) {
        return this.authService.registerUser(body, req);
    }

    @Post('/login')
    async loginUser(@Body() body: LoginDto, @Req() req: Request) {
        return this.authService.loginUser(body, req);
    }

    @Post('/logout')
    async logout(@Req() req: Request) {
        const deviceId = req.headers['deviceid'] as string;
        return this.authService.logout(deviceId);
    }
}