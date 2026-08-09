import rateLimit from 'express-rate-limit';

// ponytail: 5 login attempts per 15 min per IP to block brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Terlalu banyak percobaan login, coba lagi setelah 15 menit' },
});

// ponytail: 100 requests per minute per IP for general API routes
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Terlalu banyak request, coba lagi beberapa saat lagi' },
});
