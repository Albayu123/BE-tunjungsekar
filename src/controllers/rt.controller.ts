import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/db';
import { AppError } from '../lib/app-error';

export const getRts = async (req: Request, res: Response) => {
  const isFeatured = req.query.is_featured === 'true' ? true : undefined;
  const rts = await prisma.rt.findMany({
    where: isFeatured !== undefined ? { isFeatured } : undefined,
    orderBy: { number: 'asc' },
  });
  res.json({ success: true, data: rts });
};

export const getRtById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) throw new AppError('ID tidak valid', 400);
  const rt = await prisma.rt.findUnique({ where: { id } });
  if (!rt) throw new AppError('RT tidak ditemukan', 404);
  res.json({ success: true, data: rt });
};

export const createRt = async (req: Request, res: Response) => {
  const { number, leaderName, description, achievements, isFeatured } = req.body;
  if (!number) throw new AppError('Nomor RT wajib diisi', 400);
  const rt = await prisma.rt.create({
    data: { number: parseInt(number), leaderName, description, achievements, isFeatured: isFeatured ?? false },
  });
  res.status(201).json({ success: true, data: rt, message: 'Data RT berhasil ditambahkan' });
};

export const updateRt = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const { number, leaderName, description, achievements, isFeatured } = req.body;
  const rt = await prisma.rt.update({
    where: { id },
    data: { ...(number && { number: parseInt(number) }), leaderName, description, achievements, isFeatured },
  }).catch((err) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('RT tidak ditemukan', 404);
    }
    throw err;
  });
  res.json({ success: true, data: rt, message: 'Data RT berhasil diperbarui' });
};

export const deleteRt = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  await prisma.rt.delete({ where: { id } })
    .catch((err) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new AppError('RT tidak ditemukan', 404);
      }
      throw err;
    });
  res.json({ success: true, message: 'Data RT berhasil dihapus' });
};
