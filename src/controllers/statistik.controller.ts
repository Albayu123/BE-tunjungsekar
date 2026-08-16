import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { AppError } from '../lib/app-error';

export const getStatistik = async (req: Request, res: Response) => {
  const statistik = await prisma.statistic.findUnique({ where: { id: 1 } });
  res.json({ success: true, data: statistik || {} });
};

export const updateStatistik = async (req: Request, res: Response) => {
  const { jumlahPenduduk, jumlahRt, jumlahRw } = req.body;
  const data: { jumlahPenduduk?: number; jumlahRt?: number; jumlahRw?: number } = {};
  if (jumlahPenduduk !== undefined) data.jumlahPenduduk = parseInt(jumlahPenduduk, 10);
  if (jumlahRt !== undefined) data.jumlahRt = parseInt(jumlahRt, 10);
  if (jumlahRw !== undefined) data.jumlahRw = parseInt(jumlahRw, 10);
  if (Object.keys(data).length === 0) throw new AppError('Minimal satu field wajib diisi', 400);
  for (const value of Object.values(data)) {
    if (Number.isNaN(value) || value < 0) throw new AppError('Nilai statistik harus angka positif', 400);
  }

  // ponytail: simplified upsert for statistics ID 1
  const statistik = await prisma.statistic.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, jumlahPenduduk: 0, jumlahRt: 0, jumlahRw: 0, ...data },
  });
  res.json({ success: true, data: statistik, message: 'Statistik berhasil diperbarui' });
};