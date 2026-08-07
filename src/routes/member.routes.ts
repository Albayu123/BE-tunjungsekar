import express from 'express';
import { getMembers, createMember, updateMember, deleteMember } from '../controllers/member.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const publicMemberRouter = express.Router();
export const adminMemberRouter = express.Router();

publicMemberRouter.get('/', getMembers);

adminMemberRouter.post(
  '/',
  authenticate,
  createMember
);

adminMemberRouter.put('/:id', authenticate, updateMember);
adminMemberRouter.delete('/:id', authenticate, deleteMember);
