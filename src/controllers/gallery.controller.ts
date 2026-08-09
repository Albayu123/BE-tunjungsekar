import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { AppError } from '../lib/app-error';
import { supabase } from '../lib/supabase';

export const getGallery = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const event_id = req.query.event_id ? parseInt(req.query.event_id as string) : undefined;

  const where = event_id ? { eventId: event_id } : {};
  const total = await prisma.gallery.count({ where });
  const gallery = await prisma.gallery.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    success: true,
    data: gallery,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  });
};

export const uploadPhoto = async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('File foto diperlukan', 400);

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new AppError('Format file tidak didukung. Hanya JPEG, PNG, dan WebP yang diperbolehkan', 400);
  }

  const maxFileSize = 5 * 1024 * 1024; // 5 MB
  if (req.file.size > maxFileSize) {
    throw new AppError('Ukuran file terlalu besar. Maksimal 5 MB', 400);
  }

  const { caption, eventId } = req.body;
  const parsedEventId = eventId ? parseInt(eventId) : undefined;

  const fileName = `photos/${Date.now()}-${req.file.originalname}`;

  const { error } = await supabase.storage
    .from('gallery')
    .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

  if (error) throw new AppError('Failed to upload image', 500);

  const { data: publicUrlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(fileName);

  const data = await prisma.gallery.create({
    data: {
      url: publicUrlData.publicUrl,
      caption,
      eventId: parsedEventId
    }
  });

  res.status(201).json({
    success: true,
    data,
    message: 'Foto berhasil diunggah'
  });
};

export const deletePhoto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) throw new AppError('ID tidak valid', 400);

  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) throw new AppError('Photo not found', 404);

  // Extract filename from URL (ponytail: simplest extraction, assumes standard Supabase URL format)
  const urlParts = existing.url.split('/');
  const fileName = urlParts.slice(urlParts.indexOf('gallery') + 1).join('/');

  if (fileName) {
    await supabase.storage.from('gallery').remove([fileName]);
  }

  await prisma.gallery.delete({ where: { id } });

  res.json({
    success: true,
    message: 'Foto berhasil dihapus',
  });
};
