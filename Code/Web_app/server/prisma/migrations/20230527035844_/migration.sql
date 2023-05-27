-- DropForeignKey
ALTER TABLE "Fencer" DROP CONSTRAINT "Fencer_trainingGroupID_fkey";

-- AlterTable
ALTER TABLE "Fencer" ALTER COLUMN "trainingGroupID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Fencer" ADD CONSTRAINT "Fencer_trainingGroupID_fkey" FOREIGN KEY ("trainingGroupID") REFERENCES "TrainingGroup"("trainingGroupID") ON DELETE SET NULL ON UPDATE CASCADE;
