import { Router } from 'express';
import roomController from './room.controller';
import { authenticate, authorize, validate } from '../../middlewares';
import { createRoomSchema, updateRoomSchema } from '@hostelite/shared-validators';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  validate(createRoomSchema),
  roomController.createRoom
);

router.get(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER', 'STUDENT'),
  roomController.getAllRooms
);

router.get(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER', 'STUDENT'),
  roomController.getRoomById
);

router.patch(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  validate(updateRoomSchema),
  roomController.updateRoom
);

router.delete(
  '/:id',
  authorize('ADMIN', 'OWNER'),
  roomController.deleteRoom
);

export default router;
