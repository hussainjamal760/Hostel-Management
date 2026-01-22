import { Router } from 'express';
import uploadController from './upload.controller';
import { authenticate } from '../../middlewares';
import { upload } from '../../middlewares';

const router = Router();

router.post(
  '/',
  authenticate,
  upload.single('file'),
  uploadController.uploadImage
);

export default router;
