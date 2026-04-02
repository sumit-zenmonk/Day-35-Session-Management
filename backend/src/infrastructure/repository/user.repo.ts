import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user.entity";
import { RegisterDto } from "src/features/Auth/dto/register.dto";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async register(body: RegisterDto) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUuid(uuid: string) {
        const user = await this.find({
            where: {
                uuid: uuid
            },
            select: {
                email: true,
                name: true,
                uuid: true
            }
        });
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.findOne({
            where: {
                email: email
            },
            select: {
                email: true,
                name: true,
                uuid: true,
                password: true
            }
        });
        return user;
    }
}