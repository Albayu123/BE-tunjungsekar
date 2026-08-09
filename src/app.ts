import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import path from 'path';
import { errorHandler } from './middlewares/error.middleware';
import { authLimiter, apiLimiter } from './middlewares/rate-limit.middleware';
import { httpCache } from './middlewares/cache.middleware';

const openapiSpecPath = path.join(process.cwd(), 'src', 'docs', 'openapi.json');
const openapiSpec = JSON.parse(readFileSync(openapiSpecPath, 'utf-8'));

// Routes
import authRouter from './routes/auth.routes';
import { publicProfileRouter, adminProfileRouter } from './routes/profile.routes';
import { publicMemberRouter, adminMemberRouter } from './routes/member.routes';
import { publicAnnouncementRouter, adminAnnouncementRouter } from './routes/announcement.routes';
import { publicEventRouter, adminEventRouter } from './routes/event.routes';
import { publicGalleryRouter, adminGalleryRouter } from './routes/gallery.routes';
import { publicRtRouter, adminRtRouter } from './routes/rt.routes';

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
}));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use(express.json());

// Welcome & Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Selamat datang di API Web Profil RW 01 Kelurahan Tunjungsekar',
    docs: '/docs',
    health: '/health',
    version: '1.0.0',
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'OK' });
});

// Swagger UI Documentation (using Cloudflare CDN assets to relieve server load & fix Vercel serverless rendering)
const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.8/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.8/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.8/swagger-ui-standalone-preset.min.js',
  ],
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, swaggerOptions));

// Base API Path
const API_BASE = '/api/v1';

// Global API Rate Limiting & Response Caching
app.use(API_BASE, apiLimiter);
app.use(API_BASE, httpCache);

// Auth (with brute-force protection rate limiter on login)
app.use(`${API_BASE}/auth/login`, authLimiter);
app.use(`${API_BASE}/auth`, authRouter);


// Profile
app.use(`${API_BASE}/profile`, publicProfileRouter);
app.use(`${API_BASE}/admin/profile`, adminProfileRouter);

// Organization Members
app.use(`${API_BASE}/organization-members`, publicMemberRouter);
app.use(`${API_BASE}/admin/organization-members`, adminMemberRouter);

// Announcements
app.use(`${API_BASE}/announcements`, publicAnnouncementRouter);
app.use(`${API_BASE}/admin/announcements`, adminAnnouncementRouter);

// Events
app.use(`${API_BASE}/events`, publicEventRouter);
app.use(`${API_BASE}/admin/events`, adminEventRouter);

// Gallery
app.use(`${API_BASE}/gallery`, publicGalleryRouter);
app.use(`${API_BASE}/admin/gallery`, adminGalleryRouter);

// RT
app.use(`${API_BASE}/rts`, publicRtRouter);
app.use(`${API_BASE}/admin/rts`, adminRtRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler (must be last middleware)
app.use(errorHandler);

export default app;
