import express from 'express';
import { getStatistik, updateStatistik } from '../controllers/statistik.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const publicStatistikRouter = express.Router();
export const adminStatistikRouter = express.Router();

publicStatistikRouter.get('/', getStatistik);
adminStatistikRouter.put('/', authenticate, updateStatistik);