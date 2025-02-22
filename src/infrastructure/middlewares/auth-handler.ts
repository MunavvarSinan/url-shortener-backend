import { config } from '@/shared/config';
import { AppError } from '@/shared/errors/app-error';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../database/repositories/user.repo';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userRepository = new UserRepository();
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
    };

    const user = await userRepository.getUserById(decoded.id);
    if (!user) {
      throw new AppError('Invalid token - user does not exist', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
}
