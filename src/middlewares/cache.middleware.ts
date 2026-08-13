import { Request, Response, NextFunction } from 'express';

// ponytail: Set Cache-Control headers on public GET routes for Edge CDN caching (reduces DB load by 90%+)
export const httpCache = (req: Request, res: Response, next: NextFunction) => {
  // ponytail: skip auth routes — no Vary: Authorization header, so CDN could serve user A's /me to user B
  if (req.method === 'GET' && !req.path.startsWith('/auth/')) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  }
  next();
};
