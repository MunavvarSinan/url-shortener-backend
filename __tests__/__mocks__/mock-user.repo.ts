import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import type { User, NewUser } from '@/infrastructure/database/schema';

export class MockUserRepository implements IUserRepository {
    private mockDb: User[] = [];

    async create(data: NewUser): Promise<User> {
        const newUser = { ...data, id: (this.mockDb.length + 1).toString(), created_at: new Date(), updated_at: new Date() };
        this.mockDb.push(newUser);
        return newUser;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.mockDb.find((user) => user.email === email) || null;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return this.mockDb.find((user) => user.username === username) || null;
    }

    async getUserById(id: string): Promise<User | null> {
        return this.mockDb.find((user) => user.id === id) || null;
    }

    clearMockDb() {
        this.mockDb = []; // Reset database for fresh tests
    }
}
