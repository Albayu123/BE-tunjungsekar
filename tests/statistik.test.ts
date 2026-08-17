import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Statistik RW', () => {
  it('GET /api/v1/statistik returns statistik data', async () => {
    const res = await request(app).get('/api/v1/statistik');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('jumlahPenduduk');
  });

  it('PUT /api/v1/admin/statistik without token returns 401', async () => {
    const res = await request(app).put('/api/v1/admin/statistik').send({ jumlahPenduduk: 2422 });
    expect(res.status).toBe(401);
  });
});