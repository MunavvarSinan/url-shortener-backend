import type { Request, Response, NextFunction } from 'express';
import type { AuthService } from '@/application/services/auth.service';
import { authValidation } from '@/application/validations/auth.validation';
import { logger } from '@/infrastructure/logger';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  constructor(private authService: AuthService) {}

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      authValidation.signup.body.parse(req.body);

      const { user, token } = await this.authService.signUp(req.body);

      logger.info({ adminId: user.id }, 'User signed up successfully');
      res.status(StatusCodes.CREATED).json({
        message: 'User account created successfully',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        },
      });
    } catch (error) {
      logger.error(error, 'User signup failed');
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      authValidation.login.body.parse(req.body);

      const { user, token } = await this.authService.signIn(req.body);

      logger.info({ adminId: user.id }, 'User logged in successfully');
      res.status(StatusCodes.OK).json({
        message: 'User logged in successfully',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        },
      });
    } catch (error) {
      logger.error(error, 'User login failed');
      next(error);
    }
  };
}
