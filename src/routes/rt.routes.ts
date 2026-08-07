import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.ts';
import { getRts, getRtById, createRt, updateRt, deleteRt } from '../controllers/rt.controller.ts';

export const publicRtRouter = Router();
export const adminRtRouter = Router();

// ponytail: Public — list & detail, no auth required
publicRtRouter.get('/', getRts);
publicRtRouter.get('/:id', getRtById);

// Admin — full CRUD, JWT required
adminRtRouter.post('/', authenticate, createRt);
adminRtRouter.put('/:id', authenticate, updateRt);
adminRtRouter.delete('/:id', authenticate, deleteRt);
