import type { Express } from 'express';
import authRoutes from './auth';
import urlRoutes from './url';

export function registerRoutes(app: Express): void {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/url', urlRoutes);
}
