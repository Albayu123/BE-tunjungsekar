import { Request, Response } from 'express';
import { prisma } from '../lib/db';


export const getProfile = async (req: Request, res: Response) => {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  res.json({ success: true, data: profile || {} });
};

export const updateProfile = async (req: Request, res: Response) => {
  // ponytail: simplified upsert for profile ID 1
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: req.body,
    create: { id: 1, ...req.body }
  });
  res.json({ success: true, data: profile, message: 'Profil berhasil diperbarui' });
};
