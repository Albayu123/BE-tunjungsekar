import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { AppError } from '../lib/app-error';

export const getAnnouncements = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const category = req.query.category as string;

  const where = category ? { category } : {};
  const total = await prisma.announcement.count({ where });
  const announcements = await prisma.announcement.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    success: true,
    data: announcements,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  });
};

export const getAnnouncementBySlug = async (req: Request, res: Response) => {
  const announcement = await prisma.announcement.findUnique({
    where: { slug: req.params.slug }
  });

  if (!announcement) throw new AppError('Announcement not found', 404);

  res.json({
    success: true,
    data: announcement
  });
};

export const createAnnouncement = async (req: Request, res: Response) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) throw new AppError('Title, content, and category are required', 400);

  const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      category,
      slug,
      authorId: req.user.userId
    }
  });

  res.status(201).json({
    success: true,
    data: announcement,
    message: 'Announcement created successfully'
  });
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid ID', 400);

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) throw new AppError('Announcement not found', 404);

  const { title, content, category } = req.body;
  let slug = existing.slug;
  if (title) {
    slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }

  const announcement = await prisma.announcement.update({
    where: { id },
    data: { title, content, category, slug }
  });

  res.json({
    success: true,
    data: announcement,
    message: 'Announcement updated successfully'
  });
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid ID', 400);

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) throw new AppError('Announcement not found', 404);

  await prisma.announcement.delete({ where: { id } });
  res.json({
    success: true,
    message: 'Announcement deleted successfully'
  });
};
