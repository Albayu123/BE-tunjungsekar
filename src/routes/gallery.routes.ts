import express from 'express';
import multer from 'multer';
import { getGallery, uploadPhoto, deletePhoto } from '../controllers/gallery.controller';
import { authenticate } from '../middlewares/auth.middleware';

const upload = multer({ storage: multer.memoryStorage() });

export const publicGalleryRouter = express.Router();
export const adminGalleryRouter = express.Router();

publicGalleryRouter.get('/', getGallery);

adminGalleryRouter.post(
  '/',
  authenticate,
  upload.single('image'),
  uploadPhoto
);

adminGalleryRouter.delete('/:id', authenticate, deletePhoto);
