-- CreateTable
CREATE TABLE "statistics" (
    "id" SERIAL NOT NULL,
    "jumlahPenduduk" INTEGER NOT NULL,
    "jumlahRt" INTEGER NOT NULL,
    "jumlahRw" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- Enable RLS (consistent with other tables)
ALTER TABLE "statistics" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "statistics" FROM anon, authenticated;