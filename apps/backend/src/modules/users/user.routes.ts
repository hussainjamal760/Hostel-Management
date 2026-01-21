import { Router } from 'express';
import userController from './user.controller';
import { authenticate, authorize, validate } from '../../middlewares';
import { createUserSchema, updateUserSchema, updateFcmTokenSchema } from '@hostelite/shared-validators';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getMe);
router.patch('/me', validate(updateUserSchema), userController.updateMe);
router.patch('/me/fcm-token', validate(updateFcmTokenSchema), userController.updateMe);

router.post(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  validate(createUserSchema),
  userController.createUser
);

router.get(
  '/',
  authorize('ADMIN', 'OWNER'),
  userController.getAllUsers
);

router.get(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  userController.getUserById
);

router.patch(
  '/:id',
  authorize('ADMIN', 'OWNER'),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authorize('ADMIN', 'OWNER'),
  userController.deleteUser
);

export default router;
