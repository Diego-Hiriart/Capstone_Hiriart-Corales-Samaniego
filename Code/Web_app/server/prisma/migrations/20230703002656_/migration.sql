-- DropForeignKey
ALTER TABLE "MesoCycle" DROP CONSTRAINT "MesoCycle_trainingGroupID_fkey";

-- AlterTable
ALTER TABLE "MesoCycle" ALTER COLUMN "trainingGroupID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MesoCycle" ADD CONSTRAINT "MesoCycle_trainingGroupID_fkey" FOREIGN KEY ("trainingGroupID") REFERENCES "TrainingGroup"("trainingGroupID") ON DELETE SET NULL ON UPDATE CASCADE;
