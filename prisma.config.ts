import { defineConfig } from 'prisma/config';
import 'dotenv/config';

// ponytail: Menggunakan DATABASE_URL (pooler port 6543) untuk semua operasi Prisma CLI
// karena port 5432 (DIRECT_URL) diblokir oleh ISP/router jaringan lokal.
// Supabase PgBouncer mendukung DDL statements (CREATE TABLE, ALTER TABLE, dll.)
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
