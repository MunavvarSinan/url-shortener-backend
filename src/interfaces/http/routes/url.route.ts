import { UrlService } from '@/application/services/url.service';
import { UrlRepository } from '@/infrastructure/database/repositories/url.repo';
import { authenticate } from '@/infrastructure/middlewares/auth-handler';
import { Router } from 'express';
import { UrlController } from '../controller/url.controller';

const router: Router = Router();
const urlRepository = new UrlRepository();
const urlService = new UrlService(urlRepository);
const urlController = new UrlController(urlService);

router.post('/', authenticate, urlController.createUrl);
router.get('/', authenticate, urlController.getUrls);
router.delete('/:id', authenticate, urlController.deleteUrl);
router.get('/:short_code', urlController.getUrlByShortCode);

export default router;
