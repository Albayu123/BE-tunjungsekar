import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/app-error';
import { Prisma } from '@prisma/client';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    } else if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Data sudah ada (duplikat)';
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && err instanceof Error && { stack: err.stack })
  });
};
