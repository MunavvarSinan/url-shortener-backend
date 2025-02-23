import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { users, type NewUser, type User } from '../schema';

export class UserRepository implements IUserRepository {
  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning().execute();
    return user;
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.email, email)).execute();
    return user.length > 0 ? user[0] : null;
  }
  async getUserByUsername(username: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.username, username)).execute();
    return user.length > 0 ? user[0] : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.id, id)).execute();
    return user.length > 0 ? user[0] : null;
  }
}
