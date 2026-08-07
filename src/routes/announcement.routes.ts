import express from 'express';
import {
  getAnnouncements,
  getAnnouncementBySlug,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcement.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const publicAnnouncementRouter = express.Router();
export const adminAnnouncementRouter = express.Router();

publicAnnouncementRouter.get('/', getAnnouncements);
publicAnnouncementRouter.get('/:slug', getAnnouncementBySlug);

adminAnnouncementRouter.post('/', authenticate, createAnnouncement);
adminAnnouncementRouter.put('/:id', authenticate, updateAnnouncement);
adminAnnouncementRouter.delete('/:id', authenticate, deleteAnnouncement);
