import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repository/user.repo';
import { AuthHelperService } from '../services/auth.service';
import { SessionRepository } from '../repository/session.repo';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
    constructor(
        private readonly authHelpService: AuthHelperService,
        private readonly userRepo: UserRepository,
        private readonly sessionRepo: SessionRepository,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // fetched token using req
            const token = req.headers.authorization || req.headers.Authorization;
            const deviceId = req.headers.deviceId || req.headers.deviceid;

            if (!token || Array.isArray(token) || !deviceId || Array.isArray(deviceId)) {
                throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            //verify token using jwt
            const user = await this.authHelpService.verifyJwtToken(token ?? '');
            if (!user) {
                throw new HttpException("invalid token found", HttpStatus.UNAUTHORIZED);
            }

            const isSessionExists = await this.sessionRepo.findSessionByDeviceId(deviceId);
            if (!isSessionExists) {
                throw new HttpException("session not exists or expired", HttpStatus.UNAUTHORIZED);
            }

            // check account's presence in DB
            const isExistsAndActiveUser = await this.userRepo.findByUuid(user.uuid);
            if (!isExistsAndActiveUser.length) {
                throw new HttpException("account not found", HttpStatus.UNAUTHORIZED);
            }

            req.user = isExistsAndActiveUser[0]
            // valid request and authenticate account 

            next();
        } catch (error) {
            console.error("Middleware Error:", error);
            throw error;
        }
    }
}