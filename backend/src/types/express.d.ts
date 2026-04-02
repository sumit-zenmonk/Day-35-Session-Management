import UserEntity from "src/domain/entities/users.entity";

declare module 'express' {
    interface Request {
        user: UserEntity;
    }
}