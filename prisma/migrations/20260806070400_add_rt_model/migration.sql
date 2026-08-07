-- CreateTable
CREATE TABLE "rts" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "leaderName" VARCHAR(100),
    "description" TEXT,
    "achievements" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rts_number_key" ON "rts"("number");

-- Enable RLS (consistent with other tables)
ALTER TABLE "rts" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "rts" FROM anon, authenticated;
