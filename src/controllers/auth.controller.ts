import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';
import { AppError } from '../lib/app-error';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) throw new AppError('Username and password are required', 400);

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) throw new AppError('Invalid credentials', 401);

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  const userWithoutPassword = {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  res.json({
    success: true,
    data: { user: userWithoutPassword, token },
    message: 'Login berhasil'
  });
};

export const me = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError('Unauthorized', 401);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) throw new AppError('User not found', 404);

  res.json({
    success: true,
    data: user
  });
};
