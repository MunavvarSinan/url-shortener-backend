// import { test, expect, beforeAll, afterAll, describe } from 'bun:test';
import type { NewUser } from '@/infrastructure/database/schema';
import { MockUserRepository } from '../../../../__mocks__/mock-user.repo';

describe('UserRepository (Mocked)', () => {
    let userRepository: MockUserRepository;

    beforeAll(() => {
        userRepository = new MockUserRepository();
        userRepository.clearMockDb();
    });

    afterAll(() => {
        userRepository.clearMockDb();
    });

    describe('create', () => {
        test('should create a new user', async () => {
            const newUser: NewUser = { email: 'test@example.com', username: 'testuser', password: 'hashedpassword' };
            const result = await userRepository.create(newUser);

            expect(result).toMatchObject(newUser);
            expect(result.id).toBeDefined();
        });
    });

    describe('getUserByEmail', () => {
        test('should find user by email', async () => {
            await userRepository.create({ email: 'test@example.com', username: 'testuser', password: 'hashedpassword' });

            const user = await userRepository.getUserByEmail('test@example.com');
            expect(user).not.toBeNull();
        });

        test('should return null if user not found', async () => {
            const user = await userRepository.getUserByEmail('notfound@example.com');
            expect(user).toBeNull();
        });
    });
});