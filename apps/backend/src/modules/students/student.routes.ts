import { Router } from 'express';
import studentController from './student.controller';
import { authenticate, authorize, validate } from '../../middlewares';
import { createStudentSchema, updateStudentSchema } from '@hostelite/shared-validators';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  validate(createStudentSchema),
  studentController.createStudent
);

router.get(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  studentController.getAllStudents
);

router.get(
  '/me',
  authorize('STUDENT'),
  studentController.getMe
);

router.get(
  '/stats',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  studentController.getStats
);

router.get(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  studentController.getStudentById
);

router.patch(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  validate(updateStudentSchema),
  studentController.updateStudent
);

router.delete(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  studentController.deleteStudent
);

export default router;
