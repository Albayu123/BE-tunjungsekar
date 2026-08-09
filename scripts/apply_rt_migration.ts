import { prisma } from '../src/lib/db';

// ponytail: Run DDL via Prisma $executeRawUnsafe using the pooler connection
async function runMigration() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "rts" (
      "id" SERIAL NOT NULL,
      "number" INTEGER NOT NULL,
      "leaderName" VARCHAR(100),
      "description" TEXT,
      "achievements" TEXT,
      "isFeatured" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "rts_pkey" PRIMARY KEY ("id")
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "rts_number_key" ON "rts"("number")
  `);

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "rts" ENABLE ROW LEVEL SECURITY
  `);

  await prisma.$executeRawUnsafe(`
    REVOKE ALL ON TABLE "rts" FROM anon, authenticated
  `);

  // Mark migration as applied in _prisma_migrations
  await prisma.$executeRawUnsafe(`
    INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
    VALUES (
      gen_random_uuid()::text,
      'manual',
      NOW(),
      '20260806070400_add_rt_model',
      NULL,
      NULL,
      NOW(),
      1
    )
    ON CONFLICT DO NOTHING
  `);

  console.log('✅ Migration 20260806070400_add_rt_model applied successfully');
  await prisma.$disconnect();
}

runMigration().catch((e) => { console.error(e); process.exit(1); });
