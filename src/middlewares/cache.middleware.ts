import { Request, Response, NextFunction } from 'express';

// ponytail: Set Cache-Control headers on public GET routes for Edge CDN caching (reduces DB load by 90%+)
export const httpCache = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  }
  next();
};
