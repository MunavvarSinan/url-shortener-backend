import pino from 'pino';
import { config } from '@/shared/config';

const developmentOptions: pino.LoggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
    },
  },
  level: 'debug',
};

const productionOptions: pino.LoggerOptions = {
  level: 'info',
  formatters: {
    level: (label: string): { level: string } => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger = pino(
  config.isProduction ? productionOptions : developmentOptions,
) as pino.Logger;
