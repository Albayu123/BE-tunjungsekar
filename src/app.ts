import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { errorHandler } from './middlewares/error.middleware';

const openapiSpec = JSON.parse(
  readFileSync(new URL('./docs/openapi.json', import.meta.url), 'utf-8')
);

// Routes
import authRouter from './routes/auth.routes';
import { publicProfileRouter, adminProfileRouter } from './routes/profile.routes';
import { publicMemberRouter, adminMemberRouter } from './routes/member.routes';
import { publicAnnouncementRouter, adminAnnouncementRouter } from './routes/announcement.routes';
import { publicEventRouter, adminEventRouter } from './routes/event.routes';
import { publicGalleryRouter, adminGalleryRouter } from './routes/gallery.routes';
import { publicRtRouter, adminRtRouter } from './routes/rt.routes';

const app = express();

app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'OK' });
});

// Swagger UI Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Base API Path
const API_BASE = '/api/v1';

// Auth
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
