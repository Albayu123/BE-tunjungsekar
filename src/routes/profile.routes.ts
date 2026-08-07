import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const publicProfileRouter = express.Router();
export const adminProfileRouter = express.Router();

publicProfileRouter.get('/', getProfile);
adminProfileRouter.put('/', authenticate, updateProfile);
