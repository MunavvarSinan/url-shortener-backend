import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { AppError } from '@/shared/errors/app-error';
import { logger } from '@/infrastructure/logger';

interface ValidationError {
  path: string;
  message: string;
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails: ValidationError[] | undefined = undefined;

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle ZodError (validation errors)
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // Log the error
  logger.error(
    {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode,
      errors: errorDetails,
    },
    'Error occurred',
  );

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: errorDetails,
  });
}
