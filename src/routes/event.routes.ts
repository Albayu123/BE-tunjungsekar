import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const publicEventRouter = express.Router();
export const adminEventRouter = express.Router();

publicEventRouter.get('/', getEvents);
publicEventRouter.get('/:id', getEventById);

adminEventRouter.post('/', authenticate, createEvent);
adminEventRouter.put('/:id', authenticate, updateEvent);
adminEventRouter.delete('/:id', authenticate, deleteEvent);
