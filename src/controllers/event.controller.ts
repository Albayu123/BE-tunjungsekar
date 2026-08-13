import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { AppError } from '../lib/app-error';

export const getEvents = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;

  const where: Record<string, unknown> = status ? { status } : {};
  const total = await prisma.event.count({ where });
  const events = await prisma.event.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { startDate: 'desc' }
  });

  res.json({
    success: true,
    data: events,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  });
};

export const getEventById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) throw new AppError('Invalid ID', 400);

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new AppError('Event not found', 404);

  res.json({
    success: true,
    data: event
  });
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, startDate, ...rest } = req.body;
  if (!title || !startDate) throw new AppError('Title and start date are required', 400);

  const event = await prisma.event.create({
    data: {
      title,
      startDate: new Date(startDate),
      ...rest,
      createdBy: (req as Request & { user?: { userId: number } }).user?.userId || 1
    }
  });

  res.status(201).json({
    success: true,
    data: event,
    message: 'Event created successfully'
  });
};

export const updateEvent = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) throw new AppError('Invalid ID', 400);

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw new AppError('Event not found', 404);

  const data = { ...req.body };
  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.endDate) data.endDate = new Date(data.endDate);

  const event = await prisma.event.update({
    where: { id },
    data
  });

  res.json({
    success: true,
    data: event,
    message: 'Event updated successfully'
  });
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) throw new AppError('Invalid ID', 400);

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw new AppError('Event not found', 404);

  await prisma.event.delete({ where: { id } });
  res.json({
    success: true,
    message: 'Event deleted successfully'
  });
};
