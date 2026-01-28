import { Router } from 'express';
import authController from './auth.controller';
import { authenticate, validate, authLimiter } from '../../middlewares';
import {
  loginSchema,
  signupSchema,
  verifyEmailSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '@hostelite/shared-validators';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), authController.verifyEmail);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
