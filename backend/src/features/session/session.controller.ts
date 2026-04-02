import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { SessionService } from "./session.service";
import type { Request } from "express";
import { CreateOtpDto } from "./dto/otp.dto";
import { CreateSessionDto } from "./dto/create.session.dto";

@Controller('/session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) { }

    @Get()
    async getSessions(@Req() req: Request) {
        return await this.sessionService.getSessions(req.user);
    }

    @Post('/otp')
    async makeSessionRequestOtp(@Body() body: CreateOtpDto) {
        return await this.sessionService.makeSessionRequestOtp(body.email);
    }

    @Get('/otp')
    async getRequestedOtp(@Req() req: Request) {
        return await this.sessionService.getRequestedOtp(req.user);
    }

    @Post()
    async createSessionUsingOtp(@Body() body: CreateSessionDto, @Req() req: Request) {
        return await this.sessionService.createSessionUsingOtp(body, req);
    }
}