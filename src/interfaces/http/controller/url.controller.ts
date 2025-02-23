import type { Request, Response, NextFunction } from 'express';
import { UrlService } from '@/application/services/url.service';
import { urlValidation } from '@/application/validations/url.validation';
import { logger } from '@/infrastructure/logger';
import { AuthRequest } from '@/infrastructure/middlewares/auth-handler';
import { AppError } from '@/shared/errors/app-error';
import { ZodError } from 'zod';

export class UrlController {
  constructor(private urlService: UrlService) {}

  createUrl = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      try {
        urlValidation.createUrl.body.parse(req.body);
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          throw new AppError('Validation failed', 400, 'validation_error');
        }
        throw validationError;
      }

      if (!req.user) {
        throw new AppError('Unauthorized', 401, 'user_not_found');
      }

      const url = await this.urlService.createUrl({
        ...req.body,
        user_id: req.user.id,
      });

      logger.info({ urlId: url.id }, 'Url created successfully');
      res.status(201).json({
        message: 'Url created successfully',
        data: url,
      });
    } catch (error) {
      next(error);
    }
  };

  getUrls = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401, 'user_not_found');
      }

      const urls = await this.urlService.getUrls(req.user.id);
      res.status(200).json({
        message: 'Urls fetched successfully',
        data: urls,
      });
    } catch (error) {
      next(error);
    }
  };
  deleteUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const urlId = req.params['id'];
      if (!urlId) {
        throw new AppError('URL ID is required', 400, 'invalid_request');
      }

      await this.urlService.deleteUrl(urlId);
      res.status(204).end();
    } catch (error) {
      if (error instanceof Error) {
        next(new AppError(error.message, 400, 'delete_error'));
        return;
      }
      next(error);
    }
  };

  getUrlByShortCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shortCode = req.params['short_code'];

      try {
        urlValidation.getUrlByShortCode.params.parse({ short_code: shortCode });
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          throw new AppError('Invalid short code', 400, 'validation_error');
        }
        throw validationError;
      }

      const url = await this.urlService.getUrlByShortUrl(shortCode);

      if (!url) {
        throw new AppError('URL not found', 404, 'not_found');
      }

      res.redirect(url.url);
    } catch (error) {
      next(error);
    }
  };
}
