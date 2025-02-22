import { User } from '@/domain/entities';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import type { NewUser } from '@/infrastructure/database/schema';
import { config } from '@/shared/config';
import { AppError } from '@/shared/errors/app-error';
import { hash } from 'argon2';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  async signUp(data: NewUser): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.getUserByEmail(data.email);
    if (existingUser) {
      throw new AppError('User already exists', 409, 'user_already_exists');
    }
    const existingUsername = await this.userRepository.getUserByUsername(data.username);
    if (existingUsername) {
      throw new AppError('Username already exists', 409, 'username_already_exists');
    }

    const hashedPassword = await hash(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const userEntity = new User(
      user.id,
      user.email,
      user.username,
      user.password,
      user.created_at,
      user.updated_at,
    );
    const token = this.generateToken(userEntity);
    return { user: userEntity, token };
  }

  async signIn(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError('User not found', 404, 'user_not_found');
    }

    const isPasswordValid = (await hash(data.password)) === user.password;
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'invalid_credentials');
    }

    const userEntity = new User(
      user.id,
      user.email,
      user.username,
      user.password,
      user.created_at,
      user.updated_at,
    );
    const token = this.generateToken(userEntity);
    return { user: userEntity, token };
  }
}
