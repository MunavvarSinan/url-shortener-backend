import cors from 'cors';
import express from 'express';
import type { Application, Request, Response } from 'express';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { config } from '@/shared/config';
import { logger } from '@/infrastructure/logger';
import { errorHandler } from '@/infrastructure/middlewares/error-handler';
import { notFoundHandler } from '@/infrastructure/middlewares/not-found-handler';
import { registerRoutes } from '@/interfaces/http/routes';

export async function createServer(): Promise<Application> {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
    }),
  );

  // Logging middleware
  app.use((req, _res, next): void => {
    logger.info(
      {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      },
      'Incoming request',
    );
    next();
  });

  // Health Routes
  app.get('/api/v1/health', (_req: Request, res: Response): void => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
    });
  });

  // Register routes
  registerRoutes(app);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
