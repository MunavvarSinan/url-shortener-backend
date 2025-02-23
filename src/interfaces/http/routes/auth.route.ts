import { AuthService } from '@/application/services/auth.service';
import { UserRepository } from '@/infrastructure/database/repositories/user.repo';
import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';

const router: Router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/sign-up', authController.signup);
router.post('/sign-in', authController.signin);

export default router;
