import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { AppError } from '../lib/app-error';

export const getMembers = async (req: Request, res: Response) => {
  const members = await prisma.organizationMember.findMany({
    orderBy: { order: 'asc' }
  });
  res.json({ success: true, data: members });
};

export const createMember = async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.position) throw new AppError('Name and position required', 400);

  const member = await prisma.organizationMember.create({
    data: req.body
  });
  res.status(201).json({ success: true, data: member, message: 'Anggota berhasil ditambahkan' });
};

export const updateMember = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid ID', 400);

  const existing = await prisma.organizationMember.findUnique({ where: { id } });
  if (!existing) throw new AppError('Member not found', 404);

  const member = await prisma.organizationMember.update({
    where: { id },
    data: req.body
  });
  res.json({ success: true, data: member, message: 'Anggota berhasil diperbarui' });
};

export const deleteMember = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid ID', 400);

  const existing = await prisma.organizationMember.findUnique({ where: { id } });
  if (!existing) throw new AppError('Member not found', 404);

  await prisma.organizationMember.delete({ where: { id } });
  res.json({ success: true, message: 'Anggota berhasil dihapus' });
};
