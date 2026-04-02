import { faker } from '@faker-js/faker';
import { dataSource, options } from './data-source';
import { UserEntity } from 'src/domain/entities/user.entity';
import { BcryptService } from '../services/bcrypt.service';

async function create() {
    dataSource.setOptions({
        ...options,
    });

    await dataSource.initialize();

    const bcryptService = new BcryptService();
    const hashedPassword = await bcryptService.hashPassword("123");

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of Array.from(Array(15).keys())) {
            await queryRunner.manager.save(UserEntity, {
                email: faker.internet.email(),
                password: hashedPassword,
                name: faker.person.fullName(),
            });
        }

        await queryRunner.commitTransaction();
        console.info('✅ Seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
    }
}

void create();