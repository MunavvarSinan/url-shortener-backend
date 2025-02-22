import { createServer } from '@/infrastructure/server';
import { logger } from '@/infrastructure/logger';
import { config } from '@/shared/config';

import http from 'http';

async function bootstrap(): Promise<void> {
  try {
    const app = await createServer();
    const httpServer = http.createServer(app);

    httpServer.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });

    const shutdown = async (): Promise<void> => {
      logger.info('Shutting down server...');
      httpServer.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
