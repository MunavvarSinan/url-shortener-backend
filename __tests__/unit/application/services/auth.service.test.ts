import { AuthService } from '@/application/services/auth.service';
import { MockUserRepository } from '../../../__mocks__/mock-user.repo';
import { AppError } from '@/shared/errors/app-error';
import { hash } from 'argon2';

describe('AuthService (Mocked)', () => {
    let authService: AuthService;
    let userRepository: MockUserRepository;

    beforeEach(() => {
        userRepository = new MockUserRepository();
        userRepository.clearMockDb();
        authService = new AuthService(userRepository);
    });

    test('should sign up a new user', async () => {
        const userData = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
        };

        const result = await authService.signUp(userData);

        expect(result.user.email).toBe(userData.email);
        expect(result.user.username).toBe(userData.username);
        expect(result.token).toBeDefined();
    });

    test('should not sign up with an existing email', async () => {
        const userData = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
        };

        // Add a user with the same email to the mock repository
        await userRepository.create({
            ...userData,
            password: await hash(userData.password),
        });

        await expect(authService.signUp(userData)).rejects.toThrow(
            new AppError('User already exists', 409, 'user_already_exists'),
        );
    });

    test('should not sign up with an existing username', async () => {
        const userData = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
        };

        // Add a user with the same username to the mock repository
        await userRepository.create({
            ...userData,
            password: await hash(userData.password),
        });

        const newUserData = {
            email: 'another@example.com',
            username: 'testuser', // Same username
            password: 'password123',
        };

        await expect(authService.signUp(newUserData)).rejects.toThrow(
            new AppError('Username already exists', 409, 'username_already_exists'),
        );
    });

    test('should sign in an existing user', async () => {
        const userData = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
        };

        // Add a user to the mock repository
        await userRepository.create({
            ...userData,
            password: await hash(userData.password),
        });

        const result = await authService.signIn({
            email: userData.email,
            password: userData.password,
        });

        expect(result.user.email).toBe(userData.email);
        expect(result.user.username).toBe(userData.username);
        expect(result.token).toBeDefined();
    });

    test('should not sign in with wrong credentials', async () => {
        const userData = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
        };

        // Add a user to the mock repository
        await userRepository.create({
            ...userData,
            password: await hash(userData.password),
        });

        await expect(
            authService.signIn({
                email: userData.email,
                password: 'wrongpassword', // Incorrect password
            }),
        ).rejects.toThrow(new AppError('Invalid credentials', 401, 'invalid_credentials'));
    });

    test('should not sign in if user does not exist', async () => {
        await expect(
            authService.signIn({
                email: 'nonexistent@example.com',
                password: 'password123',
            }),
        ).rejects.toThrow(new AppError('User not found', 404, 'user_not_found'));
    });
});