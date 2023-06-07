-- AlterTable
ALTER TABLE "Fencer" ADD COLUMN     "legalGuardianPhone" TEXT,
ADD COLUMN     "school" TEXT,
ALTER COLUMN "legalGuardian" DROP NOT NULL;
