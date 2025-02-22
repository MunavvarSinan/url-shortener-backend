import type { NewUser, User } from '@/infrastructure/database/schema';

export interface IUserRepository {
  create(data: NewUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
}
